import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { getAllReceivedNotifications } from "../../../redux/action/notifications";
import { useNavigate } from "react-router-dom";

// Component to display individual notification item
const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();

  // Handle click event to navigate to the appropriate URL
  const handleClick = () => {
    if (notification.navURL) {
      navigate(notification.navURL);
    } else if (notification.url) {
      window.location.href = notification.url;
    }
  };

  return (
    <Flex
      p={5}
      border="1px solid #eee"
      justifyContent="space-between"
      flexDirection="column"
      cursor={notification.navURL || notification.url ? "pointer" : "default"}
      onClick={handleClick}
    >
      <Text fontSize={18} fontWeight={500}>
        {notification.heading}
      </Text>
      <Text>{notification.body}</Text>
      <Text fontSize={12} color="#777">
        {notification.createdAt
          ? `${formatDistanceToNow(new Date(notification.createdAt))} ago`
          : ""}
      </Text>
    </Flex>
  );
};

// Main component to display admin notifications
export default function AdminNotifications() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notificationReducer.adminNotifications || []
  );

  // Fetch notifications when the component mounts
  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("ProfileData"));
    const userId = localData?.result?._id;
    if (userId) {
      dispatch(getAllReceivedNotifications(userId, "admin"));
    }
  }, [dispatch]);

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
          w="fit-content"
          bg="rgba(255, 255, 255, 0.5)"
          mx="auto"
          my={20}
        >
          No notifications yet
        </Text>
      ) : (
        <Flex flexDirection="column" borderRadius={20} bg="#fff">
          {memoizedNotifications.map((notification, index) => (
            <NotificationItem key={index} notification={notification} />
          ))}
        </Flex>
      )}
    </>
  );
}