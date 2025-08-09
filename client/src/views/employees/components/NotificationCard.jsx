import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (notification.navURL) {
      navigate(notification.navURL);
    } else if (notification.url) {
      window.location.href = notification.url;
    }
  };

  return (
    <div
      className={`p-5 !border !border-gray-200 rounded-lg flex flex-col justify-between cursor-pointer my-1
        transition-colors duration-200 hover:bg-gray-100`}
      style={{
        color: "#767680",
        cursor: notification.navURL || notification.url ? "pointer" : "default",
      }}
      onClick={handleClick}
    >
      <h3 className="text-lg font-medium">{notification.heading}</h3>
      <p className="text-base">{notification.body}</p>
      <p className="text-xs" style={{ color: "#999" }}>
        {notification.createdAt
          ? `${formatDistanceToNow(new Date(notification.createdAt))} ago`
          : ""}
      </p>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    navURL: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default NotificationItem;
