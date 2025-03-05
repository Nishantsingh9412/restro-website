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
      console.log(data);
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
    socket.on("hideDeliveryOffer", handleHideDeliveryOffer);
    socket.on("liveLocation", handleLiveLocationUpdate);
    socket.on("takeaway", handleTakeAwayOrder);
    socket.on("dineinchef", handleDineInOrderChef);
    socket.on("dineinwaiter", handleDineInOrderWaiter);

    // Cleanup socket event listeners when the component unmounts
    return () => {
      socket.off("notification", handleNotification);
      socket.off("delivery", handleDelivery);
      socket.off("hideDeliveryOffer", handleHideDeliveryOffer);
      socket.off("liveLocation", handleLiveLocationUpdate);
      socket.off("takeaway", handleTakeAwayOrder);
      socket.off("dineinchef", handleDineInOrderChef);
      socket.off("dineinwaiter", handleDineInOrderWaiter);
    };
  }, [dispatch, toast, user?.result?._id]); // Only re-run when user._id changes

  return null; // No UI to render
}
