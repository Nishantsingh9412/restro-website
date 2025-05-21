// Chakra imports
import { Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

// Custom components
import DashboardCard from "./components/Cards";
import DailyTraffic from "./components/DailyTraffic";
import PieCard from "./components/PieCard";
import TotalSpent from "./components/TotalSpent";
import UserActivity from "./components/UserActivity.jsx";
import OrdersChart from "./components/OrderData.jsx";
import { MdCrisisAlert, MdInventory } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";

// API imports
import { getAdminDashboardData } from "../../../api/index.js";

export default function AdminDashboard() {
  // State variables to store API data
  const [dashboardData, setDashboardData] = useState({
    totalStocksQuantity: 0,
    lowStocksQuantity: 0,
    expiredItems: { total: 0 },
    suppliersByLocation: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      const response = await getAdminDashboardData();

      if (response?.status === 200 && response?.data?.result) {
        const {
          totalStocksQuantity = 0,
          lowStocksQuantity = 0,
          expiredItems = { total: 0 },
          suppliersByLocation = [],
        } = response.data.result;

        setDashboardData({
          totalStocksQuantity,
          lowStocksQuantity,
          expiredItems,
          suppliersByLocation,
        });
      } else {
        console.warn("Unexpected API response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loader component
  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" color="var(--primary)" />
      </Flex>
    );
  }

  // Render the dashboard
  return (
    <Flex direction="column" gap="20px" pt={{ base: "130px", md: "20px" }}>
      {/* Header section */}
      <Flex justifyContent="space-between" alignItems="center" fontWeight="500">
        <Text color="var(--primary)" fontSize="28px">
          Overview
        </Text>
      </Flex>

      {/* Dashboard cards section */}
      <SimpleGrid columns={{ md: 3, base: 1 }} gap="20px" mb="20px">
        <DashboardCard
          color="#e847a5"
          bg="#ffbbee"
          border="#fee1f9"
          label="Total Stock Quantity"
          value={dashboardData.totalStocksQuantity}
          icon={MdInventory}
        />
        <DashboardCard
          color="#e27e35"
          bg="#ffdcbc"
          border="#ffebd8"
          label="Low Stock Alert"
          value={dashboardData.lowStocksQuantity}
          icon={IoMdAlert}
        />
        <DashboardCard
          color="#035d5d"
          bg="#9ef6f7"
          border="#d7f7f7"
          label="Expiry Alert"
          value={dashboardData.expiredItems.total}
          icon={MdCrisisAlert}
        />
      </SimpleGrid>

      {/* Total spent section */}
      <TotalSpent />

      {/* Additional charts section */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
        <DailyTraffic />
        <PieCard totalPieChartData={dashboardData.suppliersByLocation} />
        <OrdersChart />
        <UserActivity />
      </SimpleGrid>
    </Flex>
  );
}
