import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../api/socket";
// import { getAuth } from "../redux/action/auth";
import { getAllReceivedNotifications } from "../redux/action/notifications";
import {
  getActiveDeliveryAction,
  getAllAvailabelDeliveryAction,
  getCompletedDeliveriesAction,
} from "../redux/action/delivery";
import { getDeliveryDashboardDataAction } from "../redux/action/deliveryDashboard";

export default function SocketInitializer() {
  const auth = useSelector((state) => state.authReducer?.data);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("ProfileData"));

  useEffect(() => {
    // if (!auth) {
    // const user = JSON.parse(localStorage.getItem("ProfileData"));
    // console.log("USER", user, user?.result?._id);
    // // if (user?.result?._id) dispatch(getAuth(user.result._id));
    // return;
    // }
    // Emit event when user joins
    if (user?.result?._id) socket.emit("userJoined", user.result._id);

    // Send heartbeat every 10 seconds
    const heartbeatInterval = user?.result?._id
      ? setInterval(() => {
          socket.emit("heartbeat", user.result._id);
        }, 10000)
      : 1;

    if (user && !user?.result?.email) {
      dispatch(getAllReceivedNotifications(user.result?._id));
      dispatch(getCompletedDeliveriesAction(user.result?._id));
      dispatch(getAllAvailabelDeliveryAction(user.result?._id));
      dispatch(getActiveDeliveryAction(user.result?._id));
      dispatch(getDeliveryDashboardDataAction(user.result?._id));
    }

    // Cleanup on component unmount
    return () => {
      clearInterval(heartbeatInterval);
      socket.disconnect();
    };
  }, [auth]);

  socket.on("notification", (data) =>
    dispatch({ type: "ADD_NOTIFICATION", data })
  );

  socket.on("delivery", (data) => {
    console.log(data);
    dispatch({ type: "ADD_DELIVERY", data });
  });

  console.log("location temp id", user?.result?._id);

  socket.on("hideDeliveryOffer", (data) => {
    console.log(auth?._id, data);
    if (auth?._id === data?.userId)
      dispatch({
        type: "DELETE_SINGLE_DELIVERY",
        data: { _id: data.deliveryId },
      });
  });
  return <></>;
}
