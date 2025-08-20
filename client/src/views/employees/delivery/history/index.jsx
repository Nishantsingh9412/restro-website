import { useState } from "react";
import CalendarOrders from "./CalendarOrderModal";

function DeliveryHistory() {
  const [open, setOpen] = useState(false);

  const orders = [
    {
      date: "2025-07-30",
      time: "08:15 AM - 09:15 AM",
      status: "Completed",
      title: "Pizza Order",
    },
    {
      date: "2025-07-30",
      time: "09:00 AM - 10:00 AM",
      status: "Completed",
      title: "Pizza Order",
    },
    {
      date: "2025-07-30",
      time: "11:00 AM - 11:45 AM",
      status: "Rejected",
      title: "Pizza Order",
    },
    {
      date: "2025-07-30",
      time: "03:30 PM - 05:15 PM",
      status: "Pending",
      title: "Pizza Order",
    },
    {
      date: "2025-07-31",
      time: "09:00 AM - 10:00 AM",
      status: "Completed",
      title: "Pizza Order",
    },
  ];

  return (
    <>
      <button
        className="p-2 bg-blue-500 text-white"
        onClick={() => setOpen(true)}
      >
        Open Calendar
      </button>

      <CalendarOrders
        isOpen={open}
        orders={orders}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default DeliveryHistory;
