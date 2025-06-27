// // Chakra imports
// import { Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
// import { useEffect, useState } from "react";

// // Custom components
// import DashboardCard from "./components/Cards";
// import DailyTraffic from "./components/DailyTraffic";
// import PieCard from "./components/PieCard";
// import TotalSpent from "./components/TotalSpent";
// import UserActivity from "./components/UserActivity.jsx";
// import OrdersChart from "./components/OrderData.jsx";
// import { MdCrisisAlert, MdInventory } from "react-icons/md";
// import { IoMdAlert } from "react-icons/io";

// // API imports
// import { getAdminDashboardData } from "../../../api/index.js";

// export default function AdminDashboard() {
//   // State variables to store API data
//   const [dashboardData, setDashboardData] = useState({
//     totalStocksQuantity: 0,
//     lowStocksQuantity: 0,
//     expiredItems: { total: 0 },
//     suppliersByLocation: [],
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch dashboard data from API
//   const fetchDashboardData = async () => {
//     try {
//       const response = await getAdminDashboardData();

//       if (response?.status === 200 && response?.data?.result) {
//         const {
//           totalStocksQuantity = 0,
//           lowStocksQuantity = 0,
//           expiredItems = { total: 0 },
//           suppliersByLocation = [],
//         } = response.data.result;

//         setDashboardData({
//           totalStocksQuantity,
//           lowStocksQuantity,
//           expiredItems,
//           suppliersByLocation,
//         });
//       } else {
//         console.warn("Unexpected API response structure:", response);
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // Loader component
//   if (isLoading) {
//     return (
//       <Flex justifyContent="center" alignItems="center" height="50vh">
//         <Spinner size="xl" color="var(--primary)" />
//       </Flex>
//     );
//   }

//   // Render the dashboard
//   return (
//     <Flex direction="column" gap="20px" pt={{ base: "130px", md: "20px" }}>
//       {/* Header section */}
//       <Flex justifyContent="space-between" alignItems="center" fontWeight="500">
//         <Text className="text-primary" fontSize="28px">
//           Overview
//         </Text>
//       </Flex>
//       {/* Dashboard cards section */}
//       <SimpleGrid columns={{ md: 3, base: 1 }} gap="20px" mb="20px">
//         <DashboardCard
//           color="#e847a5"
//           bg="#ffbbee"
//           border="#fee1f9"
//           label="Total Stock Quantity"
//           value={dashboardData.totalStocksQuantity}
//           icon={MdInventory}
//         />
//         <DashboardCard
//           color="#e27e35"
//           bg="#ffdcbc"
//           border="#ffebd8"
//           label="Low Stock Alert"
//           value={dashboardData.lowStocksQuantity}
//           icon={IoMdAlert}
//         />
//         <DashboardCard
//           color="#035d5d"
//           bg="#9ef6f7"
//           border="#d7f7f7"
//           label="Expiry Alert"
//           value={dashboardData.expiredItems.total}
//           icon={MdCrisisAlert}
//         />
//       </SimpleGrid>

//       {/* Total spent section */}
//       <TotalSpent />

//       {/* Additional charts section */}
//       <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
//         <DailyTraffic />
//         <PieCard totalPieChartData={dashboardData.suppliersByLocation} />
//         <OrdersChart />
//         <UserActivity />
//       </SimpleGrid>
//     </Flex>
//   );
// }

import { FaEllipsisV } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f8f9fd] p-6 md:p-6 lg:p-8 font-sans text-[#1f1f1f]">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 xl:gap-6">
        {/* Stats */}
        <div className="flex flex-col gap-4 col-span-1 xl:col-span-1">
          <div className="bg-[#0e0e3c] text-white rounded-2xl p-4 text-center">
            <h2 className="text-2xl font-bold">05</h2>
          </div>
          <div className="bg-[#fce4cc] text-black rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">520</p>
            <p className="text-sm">Total Stocks</p>
          </div>
          <div className="bg-[#d0f5e8] text-black rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">15</p>
            <p className="text-sm">Low Stock Alert</p>
          </div>
          <div className="bg-[#e3dbff] text-black rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">65</p>
            <p className="text-sm">Expiry Alert</p>
          </div>
        </div>

        {/* Sales Mapping */}
        <div className="col-span-1 xl:col-span-1 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sales Mapping</h3>
            <div className="flex items-center gap-2 text-sm">
              <img src="/flags/germany.svg" alt="Germany" className="w-5 h-5" />
              Germany
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <img
              src="/charts/donut.png"
              alt="Sales Mapping Chart"
              className="w-32 h-32"
            />
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            <li className="flex justify-between">
              <span>Berlin</span> <span className="text-[#3c82f6]">45%</span>
            </li>
            <li className="flex justify-between">
              <span>Hamburg</span> <span className="text-[#10b981]">29%</span>
            </li>
            <li className="flex justify-between">
              <span>Munich</span> <span className="text-[#facc15]">18%</span>
            </li>
            <li className="flex justify-between">
              <span>Cologne</span> <span className="text-[#f87171]">25%</span>
            </li>
          </ul>
        </div>

        {/* Inventory Tracking */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Inventory Tracking</h3>
          <img
            src="/charts/inventory-line.png"
            alt="Inventory Tracking"
            className="w-full h-40 object-contain"
          />
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-600 rounded-full" />
              This Year
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded-full" />
              Previous Year
            </div>
          </div>
        </div>

        {/* Sales Mapping Bars */}
        <div className="col-span-2 xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sales Mapping</h3>
          <img
            src="/charts/bar-sales.png"
            alt="Sales Mapping Bar Chart"
            className="w-full h-40 object-contain"
          />
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-600 rounded-full" />
              Online
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-600 rounded-full" />
              Offline
            </div>
          </div>
        </div>

        {/* Order Data */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Order Data</h3>
          <img
            src="/charts/order-bar.png"
            alt="Order Data Chart"
            className="w-full h-40 object-contain"
          />
        </div>

        {/* Upgrade Plan */}
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Upgrade Your Plan</h3>
              <FaEllipsisV className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Please make the payment to start enjoying all the features of our
              premium plan.
            </p>
            <div className="bg-[#f2edff] p-4 rounded-xl mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">Platinum</p>
                  <p className="text-sm font-medium text-purple-600">
                    Upgrade Plan
                  </p>
                </div>
                <p className="text-xl font-semibold text-[#1f1f1f]">
                  $5,250<span className="text-sm">/Year</span>
                </p>
              </div>
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-200 rounded-md p-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Email Address"
            />
          </div>
          <button
            type="button"
            className="bg-purple-600 hover:bg-purple-700 transition text-white font-medium py-2 rounded-md text-sm"
          >
            CONTACT NOW
          </button>
        </div>

        {/* User Activity */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">User Activity</h3>
          <img
            src="/charts/user-activity.png"
            alt="User Activity Chart"
            className="w-full h-40 object-contain"
          />
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="text-center">
              <p className="text-blue-600">Last Month</p>
              <p>$3,004</p>
            </div>
            <div className="text-center">
              <p className="text-green-600">This Month</p>
              <p>$4,504</p>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contacts</h3>
            <FaEllipsisV className="text-gray-400" />
          </div>
          <ul className="space-y-4 text-sm">
            {[
              {
                name: "Jane Cooper",
                phone: "+91 9889898988",
                img: "/avatars/jane.png",
              },
              {
                name: "Kristin Watson",
                phone: "+91 9889898988",
                img: "/avatars/kristin.png",
              },
              {
                name: "Jenny Wilson",
                phone: "+91 9889898988",
                img: "/avatars/jenny.png",
              },
              {
                name: "Brooklyn Sim",
                phone: "+91 9889898988",
                img: "/avatars/brooklyn.png",
              },
            ].map((contact, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                <FaEllipsisV className="text-gray-400" />
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition text-white font-medium py-2 rounded-md text-sm"
          >
            Show All
          </button>
        </div>
      </div>
    </div>
  );
}
