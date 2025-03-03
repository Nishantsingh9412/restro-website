import { Flex, Grid, Heading, Text, Spinner } from "@chakra-ui/react";
import DeliveryCard from "./components/DeliveryCard";
import ActiveDelivery from "./components/ActiveDelivery";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  acceptDeliveryAction,
  deleteSingleDeliveryAction,
  completeDeliveryAction,
  cancelDeliveryAction,
  udpateDeliveryStatusAction,
  getActiveDeliveryAction,
  getAllAvailabelDeliveryAction,
} from "../../../redux/action/delivery";
import { statuses } from "../../../utils/constant";
import TestNavigation from "./components/Test";
import { Dialog_Boxes } from "../../../utils/constant";
import { useToast } from "../../../contexts/ToastContext";

export default function AvailableDeliveries() {
  const toast = useToast();
  const auth = useSelector((state) => state.admin.data);
  const availableDeliveries = useSelector(
    (state) => state.deliveryReducer.deliveries || []
  );
  const [loading, setLoading] = useState(true);
  const activeDelivery = useSelector(
    (state) => state.deliveryReducer.activeDelivery
  );
  const dispatch = useDispatch();
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const localId = localData?.result?._id;
  useEffect(() => {
    Promise.all([
      dispatch(getAllAvailabelDeliveryAction()),
      dispatch(getActiveDeliveryAction()),
    ]).then(() => setLoading(false));
  }, [dispatch]);

  const handleReject = (id) => {
    dispatch(deleteSingleDeliveryAction(id));
  };

  const handleCompleteDelivery = (id) => {
    dispatch(completeDeliveryAction(id, localId || auth?._id)).then(() =>
      Dialog_Boxes.showOrderCompleted()
    );
  };

  const handleUpdateStatus = (id, status) => {
    if (status === statuses.COMPLETED) return handleCompleteDelivery(id);
    dispatch(udpateDeliveryStatusAction(id, status, localId || auth?._id));
  };

  const handleAccept = (id) => {
    dispatch(acceptDeliveryAction(id, localId || auth?._id)).then(() =>
      toast("Order Accepted", "success")
    );
  };

  const handleCancel = (id) => {
    dispatch(cancelDeliveryAction(id, localId || auth?._id));
  };
  if (loading)
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (activeDelivery)
    return (
      <ActiveDelivery
        activeDelivery={activeDelivery}
        handleCancel={(id) =>
          Dialog_Boxes.showCancelConfirmation(id, handleCancel)
        }
        handleUpdateStatus={(id, message) =>
          Dialog_Boxes.showStatusChangeConfirm(id, message, handleUpdateStatus)
        }
      />
    );
  else
    return (
      <>
        <TestNavigation />
        <Heading mt={10} mb={5} fontSize={20}>
          Available Deliveries
        </Heading>
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
                handleAccept={(id) => {
                  Dialog_Boxes.showAcceptConfirmation(id, handleAccept);
                }}
                handleReject={(id) =>
                  Dialog_Boxes.showRejectConfirmation(id, handleReject)
                }
                disabled={activeDelivery ? true : false}
              />
            ))}
          </Grid>
        )}
      </>
    );
}
