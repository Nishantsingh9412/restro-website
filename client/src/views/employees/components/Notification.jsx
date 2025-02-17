import { useSelector, useDispatch } from "react-redux";
import { Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { getAllReceivedNotifications } from "../../../redux/action/notifications";
import NotificationItem from "../../employees/components/NotificationCard";
import { userTypes } from "../../../utils/constant";

export default function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notificationReducer.notifications
  );
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      await dispatch(getAllReceivedNotifications(userTypes.EMPLOYEE));
      setLoading(false);
    };
    fetchNotifications();
  }, [dispatch]);

  const memoizedNotifications = useMemo(() => notifications, [notifications]);

  return (
    <>
      <Heading mt={20} mb={5} fontSize={20}>
        Notifications
      </Heading>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" mt={20}>
          <Spinner size="xl" />
        </Flex>
      ) : memoizedNotifications.length === 0 ? (
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
