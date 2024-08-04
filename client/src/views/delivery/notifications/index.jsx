import { useSelector } from "react-redux";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Notifications() {
  const notifications = useSelector(
    (state) => state.notificationReducer.notifications || []
  );

  return (
    <>
      <Heading mt={20} mb={5} fontSize={20}>
        Notifications
      </Heading>
      {notifications.length === 0 ? (
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
  const history = useHistory();
  return (
    <Flex
      p={5}
      border="1px solid #eee"
      justifyContent={"space-between"}
      flexDirection={"column"}
      cursor={notification.navURL || notification.url ? "pointer" : ""}
      onClick={() => {
        if (notification.navURL) {
          history.push(notification.navURL);
        } else if (notification.url) {
          window.location.href = notification.url;
        }
      }}
    >
      <Text fontSize={18} fontWeight={500}>
        {notification.heading}
      </Text>
      <Text>{notification.body}</Text>
      <Text fontSize={12} color={"#777"}>
        {notification.createdAt
          ? formatDistanceToNow(notification.createdAt) + " ago"
          : ""}
      </Text>
    </Flex>
  );
};
