import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { showOrderDetailsAction } from "../../../../redux/action/delivery";

const daysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarOrders({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const completedOrders = useSelector(
    (state) => state.deliveryReducer?.completedDeliveries || []
  );

  // normalize API data -> { date, time, title, status }
  const normalizedOrders = useMemo(() => {
    return completedOrders.map((o) => {
      const completedDate = new Date(o.completedAt);
      const createdDate = new Date(o.createdAt);
      const yyyy = completedDate.getFullYear();
      const mm = String(completedDate.getMonth() + 1).padStart(2, "0");
      const dd = String(completedDate.getDate()).padStart(2, "0");

      return {
        date: `${dd}-${mm}-${yyyy}`,
        createdTime: createdDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        completedTime: completedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        title: o?.orderId, // or `${o.customerName}` if preferred
        status: o?.currentStatus,
        dropAddress: o?.deliveryAddress || "N/A",
        customerName: o?.customerName || "N/A",
        customerPhone: o?.customerContact || "N/A",
      };
    });
  }, [completedOrders]);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`
  );

  // Orders mapped by date
  const ordersByDate = useMemo(() => {
    const map = {};
    normalizedOrders.forEach((order) => {
      if (!map[order.date]) map[order.date] = [];
      map[order.date].push(order);
    });
    return map;
  }, [normalizedOrders]);

  const daysInMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1,
    0
  ).getDate();

  const offset = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    1
  ).getDay();

  const formatDate = (day) => {
    const yyyy = selectedMonth.getFullYear();
    const mm = String(selectedMonth.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${dd}-${mm}-${yyyy}`;
  };

  const goToPrevMonth = () =>
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goToNextMonth = () =>
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-black/40 backdrop-blur-lg border-l border-white/10 text-white shadow-lg transition-transform duration-300 z-[200] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ maxWidth: "300px", width: "100%" }}
    >
      {/* Close Button */}
      <div className="flex justify-end p-3">
        <button onClick={onClose} className="text-white !text-2xl">
          &times;
        </button>
      </div>

      {/* Calendar Header */}
      <div className="flex justify-between items-center px-4 mb-2">
        <button onClick={goToPrevMonth} className="!text-2xl">
          &lt;
        </button>
        <span className="font-semibold">
          {selectedMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={goToNextMonth} className="!text-2xl">
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs text-white mb-1 font-bold">
        {daysShort.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center text-sm font-medium">
        {[...Array(offset)].map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day);
          const hasOrders = !!ordersByDate[dateStr];

          const isToday =
            dateStr ===
            `${String(today.getDate()).padStart(2, "0")}-${String(
              today.getMonth() + 1
            ).padStart(2, "0")}-${String(today.getFullYear())}`;
          const isSelected = dateStr === selectedDate;

          return (
            <div
              key={dateStr}
              className={`relative w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer
                ${isToday ? "bg-green-500 text-black" : ""}
                ${isSelected && !isToday ? "bg-gray-300" : ""}
                hover:bg-gray-600`}
              onClick={() => setSelectedDate(dateStr)}
            >
              {day}
              {hasOrders && (
                <span className="absolute bottom-0 w-1 h-1 bg-white rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="mt-4 px-4 pb-6">
        <div className="w-full h-[1px] bg-black/20"></div>
        <h3 className="text-sm font-bold !my-3">
          <b>Date</b> {selectedDate.split("-").reverse().join("-")}
        </h3>
        <div className="w-full h-[1px] bg-black/20 mb-2"></div>

        {ordersByDate[selectedDate] ? (
          ordersByDate[selectedDate].map((o, idx) => (
            <div
              key={idx}
              className="mb-3 flex items-start gap-2 cursor-pointer"
              onClick={() => dispatch(showOrderDetailsAction(o))} // Dispatch action to show order details
            >
              <span
                className={`mt-1 w-2 h-2 rounded-full ${
                  o.status === "Delivered"
                    ? "bg-green-500"
                    : o.status === "Rejected"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              ></span>
              <div>
                <p className="text-xs text-gray-300">
                  {o.createdTime} - {o.completedTime}
                </p>
                <p className="text-sm">
                  <b>{o.title}</b> {o.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-white">No orders for this date</p>
        )}
      </div>
    </div>
  );
}

CalendarOrders.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
