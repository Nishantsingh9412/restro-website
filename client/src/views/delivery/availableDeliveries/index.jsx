import { Grid, Heading, Text } from "@chakra-ui/react";
import DeliveryCard from "./components/DeliveryCard";
import ActiveDelivery from "./components/ActiveDelivery";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  acceptDeliveryAction,
  deleteSingleDeliveryAction,
  completeDeliveryAction,
  cancelDeliveryAction,
  updateDeliveryStatusAction,
} from "../../../redux/action/delivery";
import { getSingleDelBoyAction } from "../../../redux/action/delboy";

// Main component function
export default function AvailableDeliveries() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authReducer.data);
  const availableDeliveries = useSelector(
    (state) => state.deliveryReducer.deliveries
  );
  const activeDelivery = useSelector(
    (state) => state.deliveryReducer.activeDelivery
  );
  // eslint-disable-next-line no-unused-vars
  const loggedInDelBoy = useSelector(
    (state) => state.delBoyReducer.selectedDelBoy
  );

  // Retrieve local data from localStorage
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const localId = localData?.result?._id;

  // Fetch single delivery boy data on component mount
  useEffect(() => {
    if (localId) {
      dispatch(getSingleDelBoyAction(localId));
    }
  }, [dispatch, localId]);

  // Function to show alert using SweetAlert2
  const showAlert = (
    title,
    text,
    icon,
    confirmButtonColor,
    timer,
    timerProgressBar
  ) =>
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor,
      timer,
      timerProgressBar,
    });

  // Function to show confirmation dialog using SweetAlert2
  const showConfirmation = (
    title,
    text,
    icon,
    confirmButtonColor,
    confirmButtonText,
    callback
  ) =>
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor,
      confirmButtonText,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) callback();
    });

  // Handle accept delivery action
  const handleAccept = (id) => {
    dispatch(acceptDeliveryAction(id, localId || auth?._id)).then(() =>
      showAlert(
        "Delivery Accepted",
        "Complete the order to get more delivery offers",
        "success",
        "skyblue",
        2500,
        true
      )
    );
  };

  // Handle reject delivery action
  const handleReject = (id) => {
    dispatch(deleteSingleDeliveryAction(id));
  };

  // Handle complete delivery action
  const handleCompleteDelivery = (id) => {
    dispatch(completeDeliveryAction(id, localId || auth?._id)).then(() =>
      showAlert(
        "Delivery Completed",
        "You can earn more, get more deliveries",
        "success",
        "skyblue"
      )
    );
  };

  // Handle update delivery status action
  const handleUpdateStatus = (id, status) => {
    if (status === "Completed") {
      handleCompleteDelivery(id);
    } else {
      dispatch(updateDeliveryStatusAction(id, status, localId || auth?._id));
    }
  };

  // Handle cancel delivery action
  const handleCancel = () => {
    dispatch(cancelDeliveryAction());
  };

  // Render active delivery component if there is an active delivery
  if (activeDelivery) {
    return (
      <ActiveDelivery
        activeDelivery={activeDelivery}
        handleCancel={() =>
          showConfirmation(
            "Cancel delivery in progress?",
            "Are you sure you want to cancel this delivery?",
            "warning",
            "red",
            "Yes",
            handleCancel
          )
        }
        handleUpdateStatus={(id, status) =>
          showConfirmation(
            `Change Status to ${status}`,
            `Confirm that you have ${status.toLowerCase()} the order`,
            "success",
            "green",
            "Yes",
            () => handleUpdateStatus(id, status)
          )
        }
      />
    );
  }

  // Render available deliveries or a message if there are no deliveries
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
          {availableDeliveries.map((delivery, i) => (
            <DeliveryCard
              data={delivery}
              key={i}
              handleAccept={handleAccept}
              handleReject={(id) =>
                showConfirmation(
                  "Reject delivery offer?",
                  "Are you sure you want to reject this offer?",
                  "question",
                  "red",
                  "Yes",
                  () => handleReject(id)
                )
              }
              disabled={!!activeDelivery}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
