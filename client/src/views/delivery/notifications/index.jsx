import { useSelector } from "react-redux";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { getAllReceivedNotifications } from "../../../redux/action/notifications";
// Main Notifications component
export default function Notifications() {
  // Select notifications from the Redux store
  const notifications = useSelector(
    (state) => state.notificationReducer.notifications || []
  );
  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch notifications from the server
    const localData = JSON.parse(localStorage.getItem("ProfileData"));
    const userId = localData?.result?._id;
    const role = localData?.result?.role;
    dispatch(getAllReceivedNotifications(userId, role));
  }, []);

  // Memoize notifications to avoid unnecessary re-renders
  const memoizedNotifications = useMemo(() => notifications, [notifications]);

  return (
    <>
      <Heading mt={20} mb={5} fontSize={20}>
        Notifications
      </Heading>
      {memoizedNotifications.length === 0 ? (
        <Text
          p={3}
          w={"fit-content"}
          bg={"rgba(255, 255, 255, 0.5)"}
          mx={"auto"}
          my={20}
        >
          No notifications yet
        </Text>
      ) : (
        <Flex flexDirection={"column"} borderRadius={20} bg={"#fff"}>
          {memoizedNotifications.map((noti, i) => (
            <NotificationItem key={i} notification={noti} />
          ))}
        </Flex>
      )}
    </>
  );
}

// NotificationItem component to display individual notifications
const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();

  // Handle click event to navigate or redirect based on notification properties
  const handleClick = () => {
    if (notification.navURL) {
      navigate(notification.navURL);
    } else if (notification.url) {
      window.location.href = notification.url;
    }
  };

  // Memoize formatted date to avoid unnecessary calculations
  const formattedDate = useMemo(() => {
    return notification.createdAt
      ? formatDistanceToNow(new Date(notification.createdAt)) + " ago"
      : "";
  }, [notification.createdAt]);

  return (
    <Flex
      p={5}
      border="1px solid #eee"
      justifyContent={"space-between"}
      flexDirection={"column"}
      cursor={notification.navURL || notification.url ? "pointer" : "default"}
      onClick={handleClick}
    >
      <Text fontSize={18} fontWeight={500}>
        {notification.heading}
      </Text>
      <Text>{notification.body}</Text>
      <Text fontSize={12} color={"#777"}>
        {formattedDate}
      </Text>
    </Flex>
  );
};

// PropTypes validation for NotificationItem component
NotificationItem.propTypes = {
  notification: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    navURL: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};
