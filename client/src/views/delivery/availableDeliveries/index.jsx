import {
  Flex,
  Grid,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import DeliveryCard from "./components/DeliveryCard";
import ActiveDelivery from "./components/ActiveDelivery";
import Swal from "sweetalert2";
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

export default function AvailableDeliveries() {
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
      dispatch(getAllAvailabelDeliveryAction(localId)),
      dispatch(getActiveDeliveryAction(localId)),
    ]).then(() => setLoading(false));
  }, [dispatch, localId]);

  // For Getting Delivery Boy Data End

  const showAcceptConfirmation = () =>
    Swal.fire({
      title: "Delivery Accepted",
      text: "Complete the order to get more delivery offers",
      icon: "success",
      confirmButtonColor: "skyblue",
      timer: 2500,
      timerProgressBar: true,
    });

  const showStatusChangeConfirm = (id, status) =>
    Swal.fire({
      title: "Change Status to " + status,
      text: `Confirm that you have ${status.toLowerCase()} the order`,
      icon: "success",
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) handleUpdateStatus(id, status);
    });

  const showDeliveryCompleted = () =>
    Swal.fire({
      title: "Delivery Completed",
      text: "You can earn more, get more deliveries",
      icon: "success",
      confirmButtonColor: "skyblue",
    });

  const showRejectConfirmation = (id) =>
    Swal.fire({
      title: "Reject delivery offer?",
      text: "Are you sure you want to reject this offer?",
      icon: "question",
      confirmButtonColor: "red",
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) handleReject(id);
    });

  const showCancelConfirmation = (id) =>
    Swal.fire({
      title: "Cancel delivery in progress?",
      text: "Are you sure you want to cancel this delivery?",
      icon: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Yes",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) handleCancel(id);
    });

  const handleReject = (id) => {
    console.log(id);
    dispatch(deleteSingleDeliveryAction(id));
  };

  const handleCompleteDelivery = (id) => {
    dispatch(completeDeliveryAction(id, localId || auth?._id)).then(() =>
      showDeliveryCompleted()
    );
  };

  const handleUpdateStatus = (id, status) => {
    if (status === "Completed") return handleCompleteDelivery(id);
    dispatch(udpateDeliveryStatusAction(id, status, localId || auth?._id));
  };

  const handleAccept = (id) => {
    dispatch(acceptDeliveryAction(id, localId || auth?._id)).then(() =>
      showAcceptConfirmation()
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
        handleCancel={showCancelConfirmation}
        handleUpdateStatus={showStatusChangeConfirm}
      />
    );
  else
    return (
      <>
        <Heading mt={20} mb={5} fontSize={20}>
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
                handleAccept={handleAccept}
                handleReject={showRejectConfirmation}
                disabled={activeDelivery ? true : false}
              />
            ))}
          </Grid>
        )}
      </>
    );
}
