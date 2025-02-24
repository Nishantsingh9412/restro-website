import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  List,
  ListItem,
  Box,
} from "@chakra-ui/react";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import { setFormData } from "../../redux/action/stepperFormAction";

export default function MapInput({ data, isOpen, onClose }) {
  const TOMTOM_API_KEY = import.meta.env.VITE_APP_TOMTOM_API_KEY;
  const COUNTRY_CODE = import.meta.env.VITE_APP_COUNTRY_CODE || "DE";
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);
  const [utils, setUtils] = useState({
    position: [
      data.dropLocation?.lat || 50.95042,
      data.dropLocation?.lng || 6.933551,
    ],
    locationName: data.dropLocationName || "",
    search: "",
    zoom: 13,
    suggestions: [],
    loading: false,
    error: null,
  });

  const updateUtils = (newUtils) =>
    setUtils((prev) => ({ ...prev, ...newUtils }));
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    updateUtils({ loading: true, suggestions: [], error: null });

    if (!utils.search.trim()) {
      updateUtils({ loading: false });
      return;
    }

    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
      utils.search
    )}.json?key=${TOMTOM_API_KEY}&countrySet=${COUNTRY_CODE}&radius=50000&typeahead=true`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const newSuggestions = data.results || [];
        updateUtils({
          suggestions: newSuggestions.length > 0 ? newSuggestions : [],
          error: newSuggestions.length ? null : "No results found.",
        });
      })
      .catch(() => {
        updateUtils({ suggestions: [], error: "Error fetching data." });
      })
      .finally(() => {
        updateUtils({ loading: false });
      });
  };

  const handleSearchByCoords = (lat, lng) => {
    const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${TOMTOM_API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.addresses && data.addresses.length > 0) {
          updateUtils({
            locationName: data.addresses[0].address.freeformAddress,
          });
        }
        console.log("utils", utils);
      })
      .catch((error) => {
        console.error("Error fetching reverse geocoding data:", error);
      });
  };

  const handleSuggestionClick = (suggestion) => {
    const newPosition = [suggestion.position.lat, suggestion.position.lon];

    updateUtils({
      position: newPosition,
      locationName: suggestion.address?.freeformAddress || suggestion.poi.name,
      suggestions: [],
      search: "",
    });

    if (mapRef.current) {
      if (!markerRef.current) {
        markerRef.current = new tt.Marker()
          .setLngLat([newPosition[1], newPosition[0]])
          .addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat([newPosition[1], newPosition[0]]);
      }

      mapRef.current.setCenter([newPosition[1], newPosition[0]]);
    } else {
      console.error("Map is not initialized.");
    }
  };

  function splitAddress(address) {
    if (!address.includes(",")) {
      return { error: "Invalid format: Missing comma separator." };
    }

    const parts = address.split(",").map((part) => part.trim());
    if (parts.length < 2) {
      return { error: "Invalid format: Address missing ZIP and city." };
    }

    const street = parts[0];
    const zipCity = parts[1].split(/\s+/); // Split on spaces

    if (zipCity.length < 2 || isNaN(zipCity[0])) {
      return { error: "Invalid format: ZIP code missing or invalid." };
    }

    return {
      street,
      zip: zipCity[0],
      city: zipCity.slice(1).join(" "),
    };
  }

  const handleFinalSubmit = () => {
    const { street, zip, city } = splitAddress(utils.locationName);
    dispatch(
      setFormData({
        dropLocation: {
          lat: utils.position[0],
          lng: utils.position[1],
        },
        dropLocationName: utils.locationName,
        address: street,
        address2: city,
        zip: zip,
      })
    );
    console.log("Form data updated:", utils);
    onClose();
  };

  // Initialize map
  useEffect(() => {
    setTimeout(() => {
      if (isOpen && mapContainer.current) {
        // setLoading(true);
        if (!mapRef.current) {
          mapRef.current = tt.map({
            key: TOMTOM_API_KEY,
            container: mapContainer.current,
            center: [utils.position[1], utils.position[0]],
            zoom: utils.zoom,
          });

          markerRef.current = new tt.Marker()
            .setLngLat([utils.position[1], utils.position[0]])
            .addTo(mapRef.current);

          mapRef.current.on("click", (e) => {
            const [lng, lat] = e.lngLat.toArray();
            mapRef.current.panTo([lng, lat], { duration: 200 });

            if (markerRef.current) {
              markerRef.current.setLngLat([lng, lat]);
            }

            updateUtils({ position: [lat, lng] });
            handleSearchByCoords(lat, lng);
          });
        } else {
          mapRef.current.setCenter([utils.position[1], utils.position[0]]);
          mapRef.current.setZoom(utils.zoom);
          if (markerRef.current) {
            markerRef.current.setLngLat([utils.position[1], utils.position[0]]);
          }
        }
        return () => {
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }
        };
      }
    }, 0);
  }, [isOpen]);

  // // Get user's current location
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;

  //         if (
  //           latitude >= -90 &&
  //           latitude <= 90 &&
  //           longitude >= -180 &&
  //           longitude <= 180
  //         ) {
  //           if (!utils.position[0] || !utils.position[1]) {
  //             setUtils((prev) => ({
  //               ...prev,
  //               position: [latitude, longitude],
  //             }));

  //             if (markerRef.current) {
  //               markerRef.current.setLngLat([longitude, latitude]);
  //               mapRef.current.setCenter([longitude, latitude]);
  //             }
  //           }
  //         } else {
  //           console.error("Geolocation coordinates out of range");
  //         }
  //       },
  //       (error) => {
  //         console.error("Error getting current position:", error);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search Location</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap="10px">
          <div style={{ display: "flex", gap: "10px" }}>
            <Input
              type="search"
              placeholder="Search places..."
              value={utils.search}
              onChange={(e) => updateUtils({ search: e.target.value })}
              style={{ flex: "1", padding: "10px", fontSize: "16px" }}
            />
            <Button
              borderRadius={"4px"}
              bg={"blue.500"}
              color={"#fff"}
              _hover={{ background: "blue.700" }}
              style={{ flexShrink: "0" }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
          {utils.error && <p>{utils.error}</p>}
          <List>
            {utils.suggestions.map((suggestion) => (
              <ListItem
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                {suggestion.address?.freeformAddress || suggestion.poi?.name}
              </ListItem>
            ))}
          </List>
          {/* {loading ? (
            <div>
              <Box
                height={"400px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Spinner />
              </Box>
            </div>
          ) : ( */}
          <Box
            ref={mapContainer}
            style={{
              width: "100%",
              height: "400px",
              marginTop: "10px",
              cursor: "crosshair",
            }}
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
  );
}
MapInput.propTypes = {
  data: PropTypes.object,
  onSubmit: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
