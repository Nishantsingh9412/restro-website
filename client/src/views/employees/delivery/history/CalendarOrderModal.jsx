import { useState, useMemo } from "react";
import PropTypes from "prop-types";

const daysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarOrders({ orders, isOpen, onClose }) {
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
    orders.forEach((order) => {
      if (!map[order.date]) map[order.date] = [];
      map[order.date].push(order);
    });
    return map;
  }, [orders]);

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
    return `${yyyy}-${mm}-${dd}`;
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
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(today.getDate()).padStart(2, "0")}`;
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
        <h3 className="text-sm font-bold mb-2">
          {selectedDate.split("-").reverse().join("-")}
        </h3>
        {ordersByDate[selectedDate] ? (
          ordersByDate[selectedDate].map((o, idx) => (
            <div key={idx} className="mb-3 flex items-start gap-2">
              <span
                className={`mt-1 w-2 h-2 rounded-full ${
                  o.status === "Completed"
                    ? "bg-green-500"
                    : o.status === "Rejected"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              ></span>
              <div>
                <p className="text-xs text-gray-300">{o.time}</p>
                <p className="text-sm">
                  {o.title} {o.status}
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
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
