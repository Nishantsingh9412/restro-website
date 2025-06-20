// AppInitializer.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { localStorageData } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUserData } from "../redux/action/userSlice";
import { connectSocketIfDisconnected, socket } from "../api/socket";

const AppInitializer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInData = useSelector((state) => state?.authReducer?.profile);

  useEffect(() => {
    let heartbeatInterval = null;

    const handleConnect = (userId) => {
      console.log("Socket Connected");

      // Emit user joined
      socket.emit("userJoined", userId);

      // Emit heartbeat every 10 seconds
      heartbeatInterval = setInterval(() => {
        socket.emit("heartbeat", userId);
      }, 10000);
    };

    const initialize = async () => {
      try {
        // Fetch local data from localStorage
        const localData = JSON.parse(
          localStorage.getItem(localStorageData.PROFILE_DATA)
        );
        const role = localData?.result?.role;

        // Navigate to login page
        if (!role) return navigate("/");

        // Fetch user data
        const user = await dispatch(getLoggedInUserData(role)).unwrap();

        // Navigate to login page
        if (!user || user.role !== role) return navigate("/");

        connectSocketIfDisconnected();

        // Ensure socket events are set up only once
        socket.off("connect"); // remove old handler if any
        socket.on("connect", () => handleConnect(user?._id));
      } catch (err) {
        console.error("Initialization failed", err);
        navigate("/");
      }
    };

    initialize();

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      socket.off("connect"); // clean up listener on unmount
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInData]);

  return null;
};

export default AppInitializer;
