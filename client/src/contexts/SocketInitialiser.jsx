import { socket, connectSocketIfDisconnected } from "../api/socket"; // Import socket manager
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReceivedNotifications } from "../redux/action/notifications";
import {
  getAllAvailabelDeliveryAction,
  getCompletedDeliveriesAction,
} from "../redux/action/delivery";
import { getDeliveryDashboardDataAction } from "../redux/action/deliveryDashboard";

export default function SocketInitializer() {
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.authReducer?.profile);
  const user = localStorage.getItem("ProfileData");
  // console.log("User:", user);

  useEffect(() => {
    if (!user?.result?._id) return; // Skip if user is not logged in

    console.log("User ID:", user.result._id);
    connectSocketIfDisconnected(); // Ensure socket is connected

    // Ensure socket is connected before emitting events
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("test", "Hello, server!");

      // Emit event when user joins
      socket.emit("userJoined", user.result._id);

      // Send heartbeat every 10 seconds
      const heartbeatInterval = setInterval(() => {
        socket.emit("heartbeat", user.result._id);
      }, 1000);

      // Dispatch initial actions if the user has no email (presumably means they're logged in)
      if (!user?.result?.email) {
        dispatch(getAllReceivedNotifications(user.result._id));
        dispatch(getCompletedDeliveriesAction(user.result._id));
        dispatch(getAllAvailabelDeliveryAction(user.result._id));
        dispatch(getDeliveryDashboardDataAction(user.result._id));
      }

      // Cleanup on component unmount
      return () => {
        clearInterval(heartbeatInterval);
        socket.off("connect"); // Clean up socket event listeners
      };
    });

    // Cleanup socket connection when the component unmounts
    return () => {
      socket.disconnect(); // Disconnect socket if needed
    };
  }, [dispatch, user?.result?._id]); // Only re-run when user._id changes

  // Handling socket events
  useEffect(() => {
    const handleNotification = (data) => {
      dispatch({ type: "ADD_NOTIFICATION", data });
    };
    const handleDelivery = (data) => {
      console.log(data);
      dispatch({ type: "ADD_DELIVERY", data });
    };
    const handleHideDeliveryOffer = (data) => {
      if (user?.result?._id === data?.userId) {
        dispatch({
          type: "DELETE_SINGLE_DELIVERY",
          data: { _id: data.deliveryId },
        });
      }
    };

    // Subscribe to socket events
    socket.on("notification", handleNotification);
    socket.on("delivery", handleDelivery);
    socket.on("hideDeliveryOffer", handleHideDeliveryOffer);

    // Cleanup socket event listeners when the component unmounts
    return () => {
      socket.off("notification", handleNotification);
      socket.off("delivery", handleDelivery);
      socket.off("hideDeliveryOffer", handleHideDeliveryOffer);
    };
  }, [dispatch, user?.result?._id]); // Only re-run when user._id changes

  return null; // No UI to render
}
