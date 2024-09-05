import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import { setFormData } from "../../redux/action/stepperFormAction";

export default function MapInput({ data, onSubmit }) {
  const dispatch = useDispatch();
  const [utils, setUtils] = useState({
    position: [
      data.pickupLocation?.lat || 52.52,
      data.pickupLocation?.lng || 13.405,
    ],
    locationName: data.pickupLocationName || "",
    search: '',
    zoom: 13,
    suggestions: [],
    loading: false,
    error: null,
  });

  const updateUtils = (newUtils) => setUtils((prev) => ({ ...prev, ...newUtils }));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (isOpen && mapContainer.current) {
      if (!mapRef.current) {
        console.log("Initializing map...");
        mapRef.current = tt.map({
          key: process.env.REACT_APP_TOMTOM_API_KEY,
          container: mapContainer.current,
          center: utils.position,
          zoom: utils.zoom,
        });

        markerRef.current = new tt.Marker()
          .setLngLat([utils.position[1], utils.position[0]])
          .addTo(mapRef.current);

        // Update marker position on map click
        // mapRef.current.on('click', (e) => {
        //   const [lng, lat] = e.lngLat.toArray();
        //   updateUtils({ position: [lat, lng] });
        //   handleSearchByCoords(lat, lng);

        //   if (markerRef.current) {
        //     markerRef.current.setLngLat([lng, lat]);
        //     mapRef.current.setCenter([lng, lat]); // Pan map to new center without reload
        //   }
        // });
        mapRef.current.on('click', (e) => {
          const [lng, lat] = e.lngLat.toArray();
          
          // Pan map to the new center first
          mapRef.current.panTo([lng, lat], { duration: 200 });
        
          // Update marker position
          if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat]);
          }
    
          // Update the position in state and perform reverse geocoding
          updateUtils({ position: [lat, lng] });
          handleSearchByCoords(lat, lng);
        });

      } else {
        console.log("Map already initialized, updating center and zoom...");
        mapRef.current.setCenter(utils.position);
        mapRef.current.setZoom(utils.zoom);

        if (markerRef.current) {
          markerRef.current.setLngLat([utils.position[1], utils.position[0]]);
        }
      }

      return () => {
        if (mapRef.current) {
          console.log("Cleaning up map...");
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [isOpen, utils.position, utils.zoom]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([utils.position[1], utils.position[0]]);
    }
  }, [utils.position]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
            setUtils((prev) => ({
              ...prev,
              position: [latitude, longitude],
            }));
            console.log("Current position: ", position.coords);

            if (markerRef.current) {
              markerRef.current.setLngLat([longitude, latitude]);
              mapRef.current.setCenter([longitude, latitude]); // Update center without reload
            }
          } else {
            console.error("Geolocation coordinates out of range");
          }
        },
        (error) => {
          console.error("Error getting current position:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSearch = (e) => {
    e.stopPropagation();
    e.preventDefault();
    updateUtils({ loading: true, suggestions: [], error: null });

    if (!utils.search.trim()) {
      updateUtils({ loading: false });
      return;
    }

    const countrySet = process.env.REACT_APP_COUNTRY_CODE || "DE";
    const radius = 50000;

    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(utils.search)}.json?key=${process.env.REACT_APP_TOMTOM_API_KEY}&countrySet=${countrySet}&radius=${radius}&typeahead=true`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const newSuggestions = data.results || [];
        updateUtils({
          suggestions: newSuggestions.length > 0 ? newSuggestions : [],
          error: newSuggestions.length ? null : "No results found."
        });
      })
      .catch((error) => {
        updateUtils({ suggestions: [], error: "Error fetching data." });
      })
      .finally(() => {
        updateUtils({ loading: false });
      });
  };

  const handleSearchByCoords = (lat, lng) => {
    const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${process.env.REACT_APP_TOMTOM_API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.addresses && data.addresses.length > 0) {
          updateUtils({ locationName: data.addresses[0].address.freeformAddress });
        }
      })
      .catch((error) => {
        console.error("Error fetching reverse geocoding data:", error);
      });
  };

  useEffect(() => {
    if (mapRef.current && utils.position) {
      mapRef.current.setCenter([utils.position[1], utils.position[0]]); // Pan map to new position

      if (markerRef.current) {
        markerRef.current.setLngLat([utils.position[1], utils.position[0]]);
      }
    }
  }, [utils.position, utils.zoom]);

  const handleSuggestionClick = (suggestion) => {
    console.log('Selected Suggestion:', suggestion);
    const newPosition = [suggestion.position.lat, suggestion.position.lon];
    console.log('New Position:', newPosition);

    updateUtils({
      position: newPosition,
      locationName: suggestion.address?.freeformAddress || suggestion.poi.name,
      suggestions: [],
      search: '',
    });

    if (mapRef.current) {
      if (!markerRef.current) {
        console.log('Marker is undefined, creating a new one.');
        markerRef.current = new tt.Marker()
          .setLngLat([newPosition[1], newPosition[0]])
          .addTo(mapRef.current);
      } else {
        console.log('Updating marker position:', newPosition);
        markerRef.current.setLngLat([newPosition[1], newPosition[0]]);
      }

      mapRef.current.setCenter([newPosition[1], newPosition[0]]); // Pan map to new position without animation reload
    } else {
      console.error("Map is not initialized.");
    }
  };

  const handleFinalSubmit = () => {
    console.log("Submit:", utils.position, utils.locationName);
    dispatch(setFormData({
      pickupLocation: {
        lat: utils.position[0],
        lng: utils.position[1],
      },
      pickupLocationName: utils.locationName,
    }));
    onClose();
    console.log("Submit:", utils.position, utils.locationName);
  }

  return (
    <>
      <Button
        borderRadius={"4px"}
        bg={"#029CFF"}
        color={"#fff"}
        _hover={{ background: "blue.500" }}
        onClick={onOpen}
      >
        Open Map Now
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="medium">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Input
                type="search"
                placeholder="Search places..."
                value={utils.search}
                onChange={(e) => updateUtils({ search: e.target.value })}
                style={{ flex: "1", padding: "10px", fontSize: "16px" }}
              />
              <Button
                type="submit"
                borderRadius={"4px"}
                bg={"blue.500"}
                color={"#fff"}
                _hover={{ background: "blue.700" }}
                style={{ flexShrink: "0" }}
              >
                Search
              </Button>
            </form>
            {utils.error && <p>{utils.error}</p>}
            <List>
              {utils.suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ padding: "10px", borderBottom: "1px solid #ddd", cursor: "pointer" }}
                >
                  {suggestion.address?.freeformAddress || suggestion.poi?.name}
                </ListItem>
              ))}
            </List>
            <div
              ref={mapContainer}
              style={{ width: "100%", height: "400px", marginTop: "10px", cursor: "crosshair" }}
            />
            <Button
              borderRadius={"4px"}
              bg={"#029CFF"}
              color={"#fff"}
              _hover={{ background: "blue.500" }}
              style={{ marginTop: "10px" }}
              onClick={handleFinalSubmit}
            >
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
