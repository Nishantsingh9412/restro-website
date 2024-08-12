import { useEffect, useState } from "react";
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
  Flex,
  List,
  ListItem,
} from "@chakra-ui/react";
import "@tomtom-international/web-sdk-maps/dist/maps.css"; // Correct CSS import
import tt from "@tomtom-international/web-sdk-maps"; // Import TomTom SDK

export default function MapInput({ data, onSubmit }) {
  const [utils, setUtils] = useState({
    position: [
      data.pickupLocation?.lat || 52.52, // Latitude for Berlin, Germany
      data.pickupLocation?.lng || 13.405, // Longitude for Berlin, Germany
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
  let map; // Declare map variable in the outer scope
  let marker; // Declare marker variable in the outer scope

  // Function to initialize the map
  const initializeMap = () => {
    map = tt.map({
      key: process.env.REACT_APP_TOMTOM_API_KEY,
      container: 'map',
      center: utils.position,
      zoom: utils.zoom,
    });

    marker = new tt.Marker()
      .setLngLat(utils.position)
      .addTo(map);

    // Handle click events
    map.on('click', (e) => {
      const [lng, lat] = e.lngLat.toArray();
      updateUtils({ position: [lat, lng] });
      handleSearchByCoords(lat, lng);
      if (marker) {
        marker.setLngLat([lng, lat]);
      }
    });
  };

  // Update marker position when utils.position changes
  useEffect(() => {
    if (marker) {
      marker.setLngLat([utils.position[1], utils.position[0]]);
    }
  }, [utils.position]);
  // Initialize the map when the modal is open
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        initializeMap();
      }, 100);

      // Clean up on unmount
      return () => {
        clearTimeout(timeoutId);
        if (map) {
          map.remove();
        }
      };
    }
  }, [isOpen]);

  // Get current position on component mount
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
            
            if (marker) {
              marker.setLngLat([longitude, latitude]).addTo(map);
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

  // Function to handle search input
  const handleSearch = (e) => {
    e.stopPropagation();
    e.preventDefault();
    updateUtils({ loading: true, suggestions: [], error: null });

    if (!utils.search.trim()) {
      updateUtils({ loading: false });
      return;
    }

    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(utils.search)}.json?key=${process.env.REACT_APP_TOMTOM_API_KEY}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const newSuggestions = data.results || [];
        updateUtils({ suggestions: newSuggestions.length > 0 ? newSuggestions : [], error: newSuggestions.length ? null : "No results found." });
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

  const handleSuggestionClick = (suggestion) => {
    const newPosition = [suggestion.position.lat, suggestion.position.lon];
    updateUtils({
      position: newPosition,
      locationName: suggestion.address?.freeformAddress || suggestion.poi.name,
      suggestions: [],
      search: '',
    });

    console.log("Selected location :---------------> ", suggestion);
    // Update marker position immediately when suggestion is clicked
    if (marker) {
      marker.setLngLat([suggestion.position.lon, suggestion.position.lat]).addTo(map);
    }
  };

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
                _hover={{ background: "blue" }}
              >
                Search
              </Button>
            </form>
            {utils.loading && <p>Loading...</p>}
            {utils.error && <p style={{ color: 'red' }}>{utils.error}</p>}
            {utils.suggestions.length > 0 && (
              <List spacing={1} mt={2}>
                {utils.suggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion.id || suggestion.poi.name}
                    p={2}
                    bg="pink"
                    cursor="pointer"
                    _hover={{ bg: "pink" }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.address?.freeformAddress || suggestion.poi.name}
                    {suggestion.address?.country ? `, ${suggestion.address.country}` : ''} {/* Include country if available */}
                  </ListItem>
                ))}
              </List>
            )}
            <div id="map" style={{ height: "500px", width: "100%", marginTop: "10px" }}></div>
            <Flex
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={4}
              my={3}
            >
              <p>
                Selected Location:{" "}
                <span style={{ fontWeight: 500 }}>{utils.locationName}</span>
              </p>
              <Button
                type="button"
                borderRadius={"4px"}
                bg={"green.500"}
                color={"#fff"}
                _hover={{ background: "green" }}
                disabled={!utils.locationName || !utils.position[0]}
                onClick={() => {
                  onSubmit({
                    pickupLocation: {
                      lat: utils.position[0],
                      lng: utils.position[1],
                    },
                    pickupLocationName: utils.locationName,
                  });
                  onClose();
                }}
              >
                Submit
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}