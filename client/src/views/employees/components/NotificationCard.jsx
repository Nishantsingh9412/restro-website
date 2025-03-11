import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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

export default NotificationItem;

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    navURL: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};
