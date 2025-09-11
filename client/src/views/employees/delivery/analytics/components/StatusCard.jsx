import { FiClock, FiCheckCircle, FiXCircle, FiTruck } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

function DeliveryBoyStatus() {
  const COLORS = ["#2563EB", "#CBD5E1"]; // Blue = Online, Gray = Offline

  const pieData = [
    { name: "Online", value: 380 }, // 6h20m = 380 mins
    { name: "Offline", value: 70 }, // 1h10m = 70 mins
  ];

  return (
    <div className="md:w-[30%] w-full p-4 sm:p-6 rounded-xl shadow !border bg-white flex flex-col gap-4">
      <h3 className="!text-base sm:!text-lg !font-semibold text-gray-700 !mb-2 flex items-center gap-2">
        <FiTruck className="text-[#2563EB]" /> Delivery Boy Status
      </h3>

      {/* Stats */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm items-center">
          <span className="flex items-center gap-2 text-gray-600">
            <FiClock /> Online Time
          </span>
          <span className="font-semibold text-[#2563EB]">6h 20m</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="flex items-center gap-2 text-gray-600">
            <FiXCircle /> Offline Time
          </span>
          <span className="font-semibold text-gray-400">1h 10m</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="flex items-center gap-2 text-gray-600">
            <FiClock /> Shift Hours
          </span>
          <span className="font-semibold text-gray-700">8h</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="flex items-center gap-2 text-gray-600">
            <FiCheckCircle /> Completed
          </span>
          <span className="font-semibold text-green-600">6h 20m</span>
        </div>
      </div>

      {/* Online vs Offline Pie Chart */}
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={30} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Bar for Level */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Level</span>
          <span className="font-semibold text-[#2563EB]">Gold</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#2563EB] h-3 rounded-full"
            style={{ width: "90%" }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-semibold text-gray-700">80%</span>
        </div>
      </div>

      {/* Extra Details */}
      {/* <div className="mt-4 flex flex-col gap-3 border-t pt-3">
        <div className="flex justify-between text-sm items-center">
          <span className="flex items-center gap-2 text-gray-600">
            <FiCoffee /> Breaks Taken
          </span>
          <span className="font-semibold text-gray-700">2</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="flex items-center gap-2 text-gray-600">
            <FiTruck /> Orders Delivered
          </span>
          <span className="font-semibold text-[#2563EB]">45</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="flex items-center gap-2 text-gray-600">
            <FiXCircle /> Late Deliveries
          </span>
          <span className="font-semibold text-red-500">1</span>
        </div>
      </div> */}
    </div>
  );
}

export default DeliveryBoyStatus;
