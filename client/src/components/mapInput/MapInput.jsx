import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
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

export default function MapInput({ data, onSubmit }) {
  const [utils, setUtils] = useState({
    position: [
      data.pickupLocation?.lat || 51.505,
      data.pickupLocation?.lng || -0.09,
    ],
    locationName: data.pickupLocationName || "",
    search: "",
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
    const url = `https://api.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          updateUtils({ locationName: data.display_name });
        }
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
            <form onSubmit={handleSearch}>
              <Input
                type="search"
                placeholder="Search places..."
                value={utils.search}
                onChange={(e) => updateUtils({ search: e.target.value })}
                style={{ width: "100%", padding: "10px", fontSize: "16px" }}
              />
            </form>
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
