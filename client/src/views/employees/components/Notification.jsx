import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import NotificationItem from "../../employees/components/NotificationCard";
import { userTypes } from "../../../utils/constant";
import { getAllNotifications } from "../../../redux/action/notificationSlice";

export default function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notificationReducer.data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      await dispatch(getAllNotifications(userTypes.EMPLOYEE));
      setLoading(false);
    };
    fetchNotifications();
  }, [dispatch]);

  const memoizedNotifications = useMemo(() => notifications, [notifications]);

  return (
    <div>
      {/* Heading */}
      <h2
        className="!mt-10 !mx-2 !text-2xl !font-semibold"
        style={{ color: "#767680" }}
      >
        Notifications
      </h2>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="w-12 h-12 !border-4 !border-gray-300 !border-t-[#767680] rounded-full animate-spin"></div>
        </div>
      ) : memoizedNotifications?.length === 0 ? (
        // Empty State
        <div
          className="p-3 w-fit mx-auto my-20 rounded-lg text-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            color: "#767680",
          }}
        >
          No notifications yet
        </div>
      ) : (
        // Notifications List
        <div className="flex flex-col rounded-2xl bg-white shadow p-5">
          {memoizedNotifications?.map((noti, i) => (
            <NotificationItem key={i} notification={noti} />
          ))}
        </div>
      )}
    </div>
  );
}
