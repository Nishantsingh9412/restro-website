import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import L from "leaflet";
import "leaflet-control-geocoder";
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
} from "@chakra-ui/react";
// import "../../assets/css/Map.css";

export default function MapInput({ data, onSubmit }) {
  const [utils, setUtils] = useState({
    position: [
      data.pickupLocation?.lat || 51.505,
      data.pickupLocation?.lng || -0.09,
    ],
    locationName: data.pickupLocationName || "",
    search: '',
    zoom: 13,
  });
  const updateUtils = (newUtils) =>
    setUtils((prev) => ({ ...prev, ...newUtils }));

  useEffect(() => {
    console.log(utils.position, utils.locationName);
  }, [utils.position, utils.locationName]);

  useEffect(() => {
    if (
      !data.pickupLocation?.lat &&
      !data.pickupLocation?.lng &&
      navigator.geolocation
    )
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        updateUtils({
          position: [latitude, longitude],
        });
        handleSearchByCoords(latitude, longitude);
      });
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!utils.search.trim()) return;
    const url = `https://api.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&q=${utils.search}&format=json`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          updateUtils({
            position: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
            locationName: data[0].display_name,
          });
        }
      });
  };

  const handleSearchByCoords = (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name) {
          updateUtils({ locationName: data.display_name });
        }
      })
      .catch((error) => {
        console.error("Error fetching reverse geocoding data:", error);
      });
  };

  const MyMarker = () => {
    useMapEvents({
      click: (e) => {
        updateUtils({ position: [e.latlng.lat, e.latlng.lng] });
        handleSearchByCoords(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={utils.position} />;
  };

  const SetMapView = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(utils.position);
    }, [map, utils.position, utils.zoom]);
    return null;
  };

  const handleLocationFound = (lat, lng) => {
    updateUtils({ position: [lat, lng] });
    handleSearchByCoords(lat, lng);
  };

  const CurrentLocationControl = ({ onLocationFound }) => {
    const map = useMap();

    useEffect(() => {
      const control = L.control({ position: "bottomright" });

      control.onAdd = () => {
        const button = L.DomUtil.create(
          "button",
          "leaflet-bar leaflet-control"
        );
        button.innerHTML =
          '<img src="https://static.thenounproject.com/png/2819186-200.png" alt="Recenter" class="react-icon" />';
        button.title = "Go to current location";
        button.style.backgroundColor = "#fff";
        button.style.width = "35px";
        button.style.height = "35px";
        button.style.lineHeight = "30px";
        button.style.textAlign = "center";
        button.style.fontSize = "20px";
        button.style.cursor = "pointer";

        L.DomEvent.on(button, "click", () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], map.getZoom());
              onLocationFound(latitude, longitude);
            });
          }
        });

        return button;
      };

      control.addTo(map);

      return () => control.remove();
    }, [map, onLocationFound]);

    return null;
  };

  const MapSearch = ({ updateUtils }) => {
    const map = useMap();

    useEffect(() => {
      // Create a geocoder instance
      const geocoder = L.Control.geocoder({
        geocoder: new L.Control.Geocoder.Nominatim({
          serviceUrl: "https://nominatim.openstreetmap.org/search",
          jsonp: false,
        }),
        defaultMarkGeocode: false,
      }).addTo(map);

      // Handle real-time input suggestions
      const input = document.querySelector(".leaflet-control-geocoder input");
      const resultsContainer = document.createElement("div");
      resultsContainer.className = "leaflet-control-geocoder-results";
      resultsContainer.style.position = "absolute";
      resultsContainer.style.top = "43px";
      resultsContainer.style.right = "10px";
      resultsContainer.style.zIndex = "10000";
      resultsContainer.style.background = "#fff";
      resultsContainer.style.border = "1px solid #aaa";
      resultsContainer.style.borderRadius = "4px";
      resultsContainer.style.maxHeight = "200px";
      resultsContainer.style.maxWidth = "80vw";
      resultsContainer.style.overflowY = "auto";

      if (input) {
        input.focus();
        input.value = "";
        input.addEventListener("input", () => {
          const query = input.value;
          if (query.length > 2) {
            resultsContainer.style.width = "280px";
            // Fetch suggestions for queries with more than 2 characters
            fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
            )
              .then((response) => response.json())
              .then((results) => {
                resultsContainer.innerHTML = ""; // Clear previous results
                results.forEach((result) => {
                  const item = document.createElement("div");
                  item.textContent = result.display_name;
                  item.className = "leaflet-control-geocoder-result";
                  item.style.cursor = "pointer";
                  item.style.padding = "5px";
                  item.addEventListener("click", () => {
                    const latlng = [result.lat, result.lon];
                    map.setView(latlng, map.getZoom());
                    updateUtils({
                      position: latlng,
                      locationName: result.display_name,
                    });
                    input.value = result.display_name;
                    resultsContainer.innerHTML = ""; // Clear suggestions
                  });
                  item.addEventListener("mouseenter", () => {
                    item.style.backgroundColor = "#f0f0f0";
                  });
                  item.addEventListener("mouseleave", () => {
                    item.style.backgroundColor = "white";
                  });
                  resultsContainer.appendChild(item);
                });
                // Append results container to the map container
                map.getContainer().appendChild(resultsContainer);
              });
          } else {
            resultsContainer.style.width = "0px";
            resultsContainer.innerHTML = ""; // Clear suggestions if query is too short
          }
        });

        // Remove results container on blur
        input.addEventListener("blur", () => {
          setTimeout(() => {
            resultsContainer.innerHTML = ""; // Clear suggestions on blur
          }, 200); // Delay to allow click on suggestions
        });
      }

      return () => {
        map.removeControl(geocoder);
        if (resultsContainer.parentNode) {
          resultsContainer.parentNode.removeChild(resultsContainer);
        }
      };
    }, [map, updateUtils]);

    return null;
  };

  return (
    <>
      <Button
        borderRadius={"4px"}
        bg={"green.500"}
        color={"#fff"}
        _hover={{ background: "green" }}
        onClick={onOpen}
      >
        Open Map
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="medium">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <form
              onSubmit={handleSearch}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
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
            </form> */}
            <MapContainer
              center={utils.position}
              zoom={utils.zoom}
              style={{ height: "500px", width: "100%", marginTop: "10px" }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MyMarker />
              <SetMapView />
              <MapSearch updateUtils={updateUtils} />
              <CurrentLocationControl onLocationFound={handleLocationFound} />
            </MapContainer>
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
