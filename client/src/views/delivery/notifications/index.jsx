import { useSelector, useDispatch } from "react-redux";
import { Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReceivedNotifications } from "../../../redux/action/notifications";

export default function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notificationReducer.notifications
  );
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      await dispatch(getAllReceivedNotifications("user"));
      setLoading(false);
    };
    fetchNotifications();
  }, [dispatch]);

  return (
    <>
      <Heading mt={20} mb={5} fontSize={20}>
        Notifications
      </Heading>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" mt={20}>
          <Spinner size="xl" />
        </Flex>
      ) : notifications.length === 0 ? (
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
          {notifications.map((noti, i) => (
            <NotificationItem key={i} notification={noti} />
          ))}
        </Flex>
      )}
    </>
  );
}

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();

  // Handle click event for navigation
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
      justifyContent={"space-between"}
      flexDirection={"column"}
      cursor={notification.navURL || notification.url ? "pointer" : ""}
      onClick={handleClick}
    >
      <Text fontSize={18} fontWeight={500}>
        {notification.heading}
      </Text>
      <Text>{notification.body}</Text>
      <Text fontSize={12} color={"#777"}>
        {notification.createdAt
          ? formatDistanceToNow(new Date(notification.createdAt)) + " ago"
          : ""}
      </Text>
    </Flex>
  );
};
