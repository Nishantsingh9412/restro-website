import { useState, useMemo, useCallback, useEffect } from "react";
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
import DeliveryBoyStatus from "./components/StatusCard";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryDashboardDataAction } from "../../../../redux/action/deliveryDashboard";
import PageLoader from "../../../../components/UI/Loader";

function DeliveryAnalytics() {
  const buttonFilters = ["Week", "Month", "Year"];
  const [selectedFilter, setSelectedFilter] = useState("Week");
  const dashboardData = useSelector(
    (state) => state.deliveryDashboardReducer.data
  );
  const {
    averageTimeTaken,
    longestTimeTaken,
    smallestTimeTaken,
    todayActiveDeliveries,
    todayAssignedDeliveries,
    totalAssignedDeliveries,
    todayAvailableDeliveries,
    totalCompletedDeliveries,
    totalDeliveriesCompletedToday,
    totalDeliveryCompletedPastWeekPerDay,
    totalDeliveryCompletedPastMonthPerDay,
    totalDeliveryCompletedPastYearPerMonth,
  } = dashboardData;

  const dispatch = useDispatch();
  const [utils, setUtils] = useState({
    isLoading: false,
    isError: false,
  });

  // Handle data refresh
  const handleRefresh = useCallback(() => {
    setUtils({ isLoading: true, isError: false });
    dispatch(getDeliveryDashboardDataAction())
      .then(() => setUtils({ isLoading: false, isError: false }))
      .catch(() => setUtils({ isLoading: false, isError: true }));
  }, [dispatch]);

  // Fetch data on component mount
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const data = useMemo(() => {
    if (selectedFilter === "Week") {
      const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return totalDeliveryCompletedPastWeekPerDay?.map((val, i) => ({
        name: weekDays[i],
        orders: val,
      }));
    } else if (selectedFilter === "Month") {
      return totalDeliveryCompletedPastMonthPerDay?.map((val, i) => ({
        name: `Day ${i + 1}`,
        orders: val,
      }));
    } else {
      // Yearly
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return totalDeliveryCompletedPastYearPerMonth?.map((val, i) => ({
        name: months[i],
        orders: val,
      }));
    }
  }, [
    selectedFilter,
    totalDeliveryCompletedPastWeekPerDay,
    totalDeliveryCompletedPastMonthPerDay,
    totalDeliveryCompletedPastYearPerMonth,
  ]);

  console.log(data);

  if (utils.isLoading) return <PageLoader />;

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
            onClick={handleRefresh}
          >
            <FiRefreshCcw /> Refresh
          </PrimaryActionButton>
        </div>
      </div>

      {/* Info Cards */}
      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 mb-6">
        <InfoCard
          title="DELIVERIES TODAY"
          value={totalDeliveriesCompletedToday || 0}
          details={[
            {
              label: "Assigned",
              value: todayAssignedDeliveries || 0,
            },
            {
              label: "Active",
              value: todayActiveDeliveries || 0,
            },
          ]}
        />

        <InfoCard
          title="AVG DELIVERY TIME"
          value={`${Math.round((averageTimeTaken || 0) / 60)}m`}
          details={[
            {
              label: "Best",
              value: `${Math.round((smallestTimeTaken || 0) / 60)}m`,
            },
            {
              label: "Longest",
              value: `${Math.round((longestTimeTaken || 0) / 60)}m`,
            },
          ]}
        />

        <InfoCard
          title="ACTIVE ORDER"
          value={todayActiveDeliveries || 0}
          details={[
            {
              label: "Assigned",
              value: todayAssignedDeliveries || 0,
            },
            {
              label: "Available",
              value: todayAvailableDeliveries || 0,
            },
          ]}
        />

        <InfoCard
          title="SUCCESS RATE"
          value={`${Math.round(
            ((totalCompletedDeliveries || 0) / (totalAssignedDeliveries || 1)) *
              100
          )}%`}
          details={[
            {
              label: "Completed",
              value: totalCompletedDeliveries || 0,
            },
            {
              label: "Assigned",
              value: totalAssignedDeliveries || 0,
            },
          ]}
        />
      </div>

      {/* Chart + Delivery Boy Details Section */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Chart Section (70%) */}
        <div className="md:w-[70%] w-full p-4 sm:p-6 rounded-xl shadow !border bg-white">
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

        <DeliveryBoyStatus />
        {/* Delivery Boy Details Sidebar (30%) */}
      </div>
    </div>
  );
}

export default DeliveryAnalytics;
