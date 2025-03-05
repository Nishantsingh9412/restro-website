import { Flex, Grid, Heading, Text, Spinner, Button } from "@chakra-ui/react";
import DeliveryCard from "./components/DeliveryCard";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  completeDeliveryAction,
  udpateDeliveryStatusAction,
  getAllAvailabelDeliveryAction,
} from "../../../redux/action/delivery";
import { statuses } from "../../../utils/constant";
import { Dialog_Boxes } from "../../../utils/constant";
import { toggleDeliveryPersonnelAvailability } from "../../../api";
import DeliveryMap from "./components/DeliveryMap";

export default function AvailableDeliveries() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [allPickedUp, setAllPickedUp] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocations, setDropLocations] = useState([]);
  const currentLocation = useSelector((state) => {
    const { lat, lng } = state.location.currentLocation || {};
    return lat && lng ? { lat, lng } : delBoy?.lastLocation || pickupLocation;
  });
  const availableDeliveries = useSelector(
    (state) => state.deliveryReducer.deliveries || []
  );
  const delBoy = useSelector((state) => state.userReducer.data);

  const handleCompleteDelivery = (id) => {
    if (availableDeliveries.length === 1) toggleDeliveryPersonnelAvailability();
    dispatch(completeDeliveryAction(id)).then(() =>
      Dialog_Boxes.showOrderCompleted()
    );
  };

  const handleUpdateStatus = (id, status) => {
    if (status === statuses.DELIVERED) return handleCompleteDelivery(id);
    dispatch(udpateDeliveryStatusAction(id, status));
  };

  const handleUpdateAllToOutForDelivery = () => {
    availableDeliveries.forEach((delivery) => {
      if (delivery?.currentStatus === statuses.PICKED_UP) {
        dispatch(
          udpateDeliveryStatusAction(delivery?._id, statuses.OUT_FOR_DELIVERY)
        );
      }
    });
    toggleDeliveryPersonnelAvailability();
  };

  useEffect(() => {
    Promise.all([dispatch(getAllAvailabelDeliveryAction())]).then(() =>
      setLoading(false)
    );
  }, [dispatch]);

  useEffect(() => {
    if (availableDeliveries.length > 0) {
      const allPicked = availableDeliveries.every(
        ({ currentStatus }) => currentStatus === statuses.PICKED_UP
      );
      setAllPickedUp(allPicked);
      setPickupLocation(availableDeliveries[0]?.pickupLocation);
      availableDeliveries.map((delivery) => {
        setDropLocations((prev) => [
          ...prev,
          {
            lat: delivery.deliveryLocation.lat,
            lng: delivery.deliveryLocation.lng,
            orderId: delivery.orderId,
          },
        ]);
      });
      return () => {
        setDropLocations([]);
      };
    }
  }, [availableDeliveries]);

  if (loading)
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <>
      {availableDeliveries.length === 0 ? (
        <Text
          p={3}
          w={"fit-content"}
          bg={"rgba(255, 255, 255, 0.5)"}
          mx={"auto"}
          my={20}
        >
          You don&apos;t have any delivery offer at this moment
        </Text>
      ) : (
        <>
          <Heading fontSize={20} my={5}>
            Navigation Map
          </Heading>
          <DeliveryMap
            currentLocation={currentLocation ?? pickupLocation}
            pickupLocation={pickupLocation}
            dropPoints={dropLocations}
          />
          <Flex justifyContent={"space-between"} alignItems={"center"} mt={10}>
            <Heading fontSize={20}>Available Deliveries</Heading>
            {allPickedUp && (
              <Button
                colorScheme="orange"
                onClick={() =>
                  Dialog_Boxes.showStatusChangeConfirm(
                    null,
                    statuses.OUT_FOR_DELIVERY,
                    handleUpdateAllToOutForDelivery
                  )
                }
                mb={5}
                fontWeight={"bold"}
              >
                Out for Delivery
              </Button>
            )}
          </Flex>
          <Grid
            gap={5}
            gridTemplateColumns={{
              base: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            }}
          >
            {availableDeliveries?.map((delivery, i) => (
              <DeliveryCard
                data={delivery}
                key={i}
                handleUpdateStatus={(id, status) =>
                  Dialog_Boxes.showStatusChangeConfirm(
                    id,
                    status,
                    handleUpdateStatus
                  )
                }
                disabled={
                  delivery?.currentStatus === statuses.PICKED_UP ? true : false
                }
              />
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
