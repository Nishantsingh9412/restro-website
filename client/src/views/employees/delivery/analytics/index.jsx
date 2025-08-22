import { useState, useMemo } from "react";
import PrimaryActionButton from "../../../../components/UI/PrimaryActionButton";
import { FiPlus, FiRefreshCcw } from "react-icons/fi";
import InfoCard from "./components/InfoCard";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function DeliveryAnalytics() {
  const buttonFilters = ["Today", "Week", "Month"];
  const [selectedFilter, setSelectedFilter] = useState("Today");

  // Dummy data based on filter
  const data = useMemo(() => {
    if (selectedFilter === "Today") {
      return [
        { name: "8AM", orders: 50 },
        { name: "10AM", orders: 120 },
        { name: "12PM", orders: 200 },
        { name: "2PM", orders: 170 },
        { name: "4PM", orders: 250 },
        { name: "6PM", orders: 300 },
        { name: "8PM", orders: 180 },
      ];
    } else if (selectedFilter === "Week") {
      return [
        { name: "Mon", orders: 400 },
        { name: "Tue", orders: 320 },
        { name: "Wed", orders: 510 },
        { name: "Thu", orders: 420 },
        { name: "Fri", orders: 610 },
        { name: "Sat", orders: 720 },
        { name: "Sun", orders: 680 },
      ];
    } else {
      // Month
      return [
        { name: "Week 1", orders: 2200 },
        { name: "Week 2", orders: 3100 },
        { name: "Week 3", orders: 2700 },
        { name: "Week 4", orders: 3500 },
      ];
    }
  }, [selectedFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
      {/* Header and Buttons */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="!text-xl sm:!text-2xl !font-bold text-[#0F172A]">
          Delivery Analytics
        </h2>

        <div className="flex flex-wrap gap-3">
          <PrimaryActionButton
            bgColor="!bg-[#2563EB] hover:!bg-[#3D70DFFF]"
            className="rounded-lg w-full sm:w-auto"
          >
            <FiPlus /> Create Order
          </PrimaryActionButton>

          {/* Filter Buttons */}
          <div className="!border flex justify-around gap-5 rounded-lg px-3 sm:px-5 py-2 w-full sm:w-auto">
            {buttonFilters.map((title, index) => (
              <button
                key={index}
                className={`${
                  selectedFilter === title
                    ? "!text-[#2563EB] !font-semibold"
                    : "!text-gray-600"
                } text-sm sm:text-base`}
                onClick={() => setSelectedFilter(title)}
              >
                {title}
              </button>
            ))}
          </div>

          <PrimaryActionButton
            bgColor="!bg-[#FFFFFFFF] hover:!bg-[#F4F4F4FF]"
            textColor="!text-black"
            className="!border rounded-lg w-full sm:w-auto"
          >
            <FiRefreshCcw /> Refresh
          </PrimaryActionButton>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 mb-6">
        <InfoCard
          title="DELIVERIES TODAY"
          value="753"
          details={[
            { label: "Avg/Order", value: "256" },
            { label: "Refunds", value: "5" },
          ]}
        />
        <InfoCard
          title="AVG DELIVERY TIME"
          value="75m"
          details={[
            { label: "Avg/Order", value: "256" },
            { label: "Best", value: "5m" },
          ]}
        />
        <InfoCard
          title="ACTIVE ORDER"
          value="12"
          details={[
            { label: "Online", value: "25" },
            { label: "Idle", value: "5" },
          ]}
        />
        <InfoCard
          title="SUCCESS RATE"
          value="82%"
          details={[
            { label: "Cancelled", value: "2" },
            { label: "Returned", value: "5" },
          ]}
        />
      </div>

      {/* Chart Section */}
      <div className="flex-1 p-4 sm:p-6 rounded-xl shadow !border bg-white">
        <h3 className="!text-base sm:!text-lg !font-semibold text-gray-700 !mb-4">
          Orders Overview ({selectedFilter})
        </h3>
        <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#0F172A" }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#1E293B", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DeliveryAnalytics;
