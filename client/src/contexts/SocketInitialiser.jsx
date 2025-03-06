import { socket } from "../api/socket"; // Import socket manager
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDeliveryBoyLocation } from "../redux/action/location";
import { useToast } from "./useToast";
import {
  addDineInOrderToChef,
  addTakeAwayOrder,
} from "../redux/action/Employees/chef";
import { addDineInOrderToWaiter } from "../redux/action/waiter";
import { showDeliveryOffer } from "../redux/action/Employees/deliveryBoy";

export default function SocketInitializer() {
  const dispatch = useDispatch();
  const user = localStorage.getItem("ProfileData");
  const toast = useToast();

  useEffect(() => {
    const handleNotification = (data) => {
      toast(data?.heading, "success");
      dispatch({ type: "ADD_NOTIFICATION", data });
    };

    const handleDelivery = (data) => {
      dispatch({ type: "ADD_DELIVERY", data });
    };

    const handleTakeAwayOrder = (data) => {
      dispatch(addTakeAwayOrder(data));
    };

    const handleDineInOrderWaiter = (data) => {
      dispatch(addDineInOrderToWaiter(data));
    };
    const handleDineInOrderChef = (data) => {
      dispatch(addDineInOrderToChef(data));
    };

    const handleDeliveryOffer = (data, supplier) => {
      dispatch(showDeliveryOffer({ data, supplier }));
    };

    const handleAcceptedDeliveryOffer = (data, orderId) => {
      const { _id, name } = data;
      dispatch({
        type: "ALLOT_DELIVERY_BOY",
        data: {
          orderId,
          assignedTo: { name, _id },
        },
      });
    };

    const handleHideDeliveryOffer = (data) => {
      if (user?.result?._id === data?.userId) {
        dispatch({
          type: "DELETE_SINGLE_DELIVERY",
          data: { _id: data.deliveryId },
        });
      }
    };

    // handle updated live location
    const handleLiveLocationUpdate = (data) => {
      console.log("data location ", data);
      const { delEmpId, locationData } = data;
      dispatch(
        setDeliveryBoyLocation({ _id: delEmpId, location: locationData })
      );
    };

    // Subscribe to socket events
    socket.on("notification", handleNotification);
    socket.on("delivery", handleDelivery);
    socket.on("deliveryOffer", handleDeliveryOffer);
    socket.on("acceptedDeliveryOffer", handleAcceptedDeliveryOffer);
    socket.on("hideDeliveryOffer", handleHideDeliveryOffer);
    socket.on("liveLocation", handleLiveLocationUpdate);
    socket.on("takeaway", handleTakeAwayOrder);
    socket.on("dineinchef", handleDineInOrderChef);
    socket.on("dineinwaiter", handleDineInOrderWaiter);

    // Cleanup socket event listeners when the component unmounts
    return () => {
      socket.off("notification", handleNotification);
      socket.off("delivery", handleDelivery);
      socket.off("deliveryOffer", handleDeliveryOffer);
      socket.off("acceptedDeliveryOffer", handleAcceptedDeliveryOffer);
      socket.off("hideDeliveryOffer", handleHideDeliveryOffer);
      socket.off("liveLocation", handleLiveLocationUpdate);
      socket.off("takeaway", handleTakeAwayOrder);
      socket.off("dineinchef", handleDineInOrderChef);
      socket.off("dineinwaiter", handleDineInOrderWaiter);
    };
  }, [dispatch, toast, user?.result?._id]); // Only re-run when user._id changes

  return null; // No UI to render
}
