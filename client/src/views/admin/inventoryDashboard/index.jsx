// Chakra imports
import { Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

// Custom components
import DashboardCard from "../default/components/Cards";

import { MdCrisisAlert, MdInventory } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";

// API imports
import { getInventoryDashboardData } from "../../../api/index.js";
import PieCard from "./components/PieCard.jsx";
import AlertCard from "./components/AlertCard.jsx";
import QuickActionCard from "./components/QuickActionCard.jsx";
import SuggestionCard from "./components/SuggestionCard.jsx";
import InventoryTableCard from "./components/TableCard.jsx";
import { IoAlert } from "react-icons/io5";

export default function AdminDashboard() {
  // State variables to store API data
  const [dashboardData, setDashboardData] = useState({
    items: [],
    expiredCount: 0,
    lowStockCount: 0,
    upcomingExpiry: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Destructure dashboard data
  const { items, expiredCount, lowStockCount, upcomingExpiry } = dashboardData;

  // Calculate total stock count using useMemo
  const allStockCount = useMemo(() => {
    return items.reduce(
      (acc, { available_quantity }) => acc + available_quantity,
      0
    );
  }, [items]);

  // Transform data for pie chart
  const transformedChartData = items.reduce(
    (acc, item) => {
      acc.data.push(item.available_quantity);
      acc.options.labels.push(item.item_name);
      return acc;
    },
    { data: [], options: { labels: [] } }
  );

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      const response = await getInventoryDashboardData();

      if (response?.status === 200 && response?.data?.result) {
        const {
          items = [],
          expiredCount = 0,
          lowStockCount = 0,
          upcomingExpiry = 0,
        } = response.data.result;

        setDashboardData({
          items,
          expiredCount,
          lowStockCount,
          upcomingExpiry,
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
    <Flex direction="column" gap="10px" pt={{ base: "130px", md: "10px" }}>
      {/* Header section */}
      <Flex justifyContent="space-between" alignItems="center" fontWeight="500">
        <Text color="var(--primary)" fontSize={{ base: "20px", md: "28px" }}>
          Overview
        </Text>
      </Flex>

      {/* Dashboard cards section */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap="10px" mb="20px">
        <DashboardCard
          color="#e847a5"
          bg="#ffbbee"
          border="#fee1f9"
          label="Total Stock Quantity"
          value={allStockCount}
          icon={MdInventory}
        />
        <DashboardCard
          color="#e27e35"
          bg="#ffdcbc"
          border="#ffebd8"
          label="Low Stock Alert"
          value={lowStockCount}
          icon={IoMdAlert}
        />
        <DashboardCard
          color="#035d5d"
          bg="#ff8c8ced"
          border="#ffb3b3ed"
          label="Expiry Alert"
          value={expiredCount}
          icon={MdCrisisAlert}
        />
        <DashboardCard
          color="#035d5d"
          bg="#9ef6f7"
          border="#d7f7f7"
          label="Wasted Items This Month"
          value={upcomingExpiry}
          icon={IoAlert}
        />
      </SimpleGrid>
      <Flex
        gap="10px"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <PieCard
          title="Total Stock Overview"
          chartData={transformedChartData}
        />
        <AlertCard
          lowStock={lowStockCount}
          expired={expiredCount}
          upcomingExpiry={upcomingExpiry}
        />
      </Flex>
      <Flex
        gap="10px"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <SuggestionCard items={items} />
        <QuickActionCard />
      </Flex>

      <InventoryTableCard tableData={items} />
    </Flex>
  );
}
