import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import DeliveryMap from "../availableDeliveries/components/DeliveryMap";
import { useEffect, useState } from "react";

export default function TestMap() {
  const [destination, setDestination] = useState({ lat: "", lng: "" });
  const [utils, setUtils] = useState({ showMap: false });
  const [origin, setOrigin] = useState(null);

  // Use effect to get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (origin?.lat === latitude && origin?.lng === longitude) return;
          setOrigin({ lat: latitude, lng: longitude });
          console.log("My location: ", latitude, longitude);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    } else {
      console.error("Geolocation not supported by this browser");
    }
  }, [origin]);

  // Handle input change for destination coordinates
  const handleChangeDestinationInput = (e) =>
    setDestination((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Handle form submission to toggle map visibility
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setUtils((prev) => ({ ...prev, showMap: !prev.showMap }));
  };

  return (
    <>
      <Heading mt={20} mb={5} fontSize={20}>
        Test Map
      </Heading>
      <form onSubmit={handleFormSubmit} style={{ marginBottom: "50px" }}>
        <Grid
          gap={5}
          gridTemplateColumns={{
            base: "1fr",
            md: "1fr 1fr",
          }}
        >
          <FormControl id="destination-lat" isRequired>
            <FormLabel>Latitude</FormLabel>
            <Input
              type="number"
              placeholder="Latitude"
              name="lat"
              disabled={utils.showMap}
              value={destination.lat}
              onChange={handleChangeDestinationInput}
              bg={"#fff"}
            />
          </FormControl>
          <FormControl id="destination-lng" isRequired>
            <FormLabel>Longitude</FormLabel>
            <Input
              type="number"
              placeholder="Longitude"
              name="lng"
              disabled={utils.showMap}
              value={destination.lng}
              onChange={handleChangeDestinationInput}
              bg={"#fff"}
            />
          </FormControl>
        </Grid>
        <Button
          type="submit"
          colorScheme="teal"
          mt={4}
          mx={"auto"}
          display={"block"}
          w={"fit-content"}
          p={3}
        >
          {utils.showMap ? "Change Destination" : "Show Direction"}
        </Button>
      </form>
      {utils.showMap &&
        (origin ? (
          <DeliveryMap
            origin={origin}
            destination={destination}
            center={origin}
          />
        ) : (
          <Text my={20} mx={"auto"} width={"fit-content"} p={3} bg={"#eee"}>
            Loading...
          </Text>
        ))}
    </>
  );
}
