// Chakra imports
import { Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

// Custom components
import DashboardCard from "./components/Cards";
import DailyTraffic from "./components/DailyTraffic";
import PieCard from "./components/PieCard";
import TotalSpent from "./components/TotalSpent";
// import WeeklyRevenue from "./components/WeeklyRevenue";

// API imports
import {
  totalStocksAPI,
  lowStocksAPI,
  expiredItemsAPI,
} from "../../../api/index.js";

export default function UserReports() {
  // State variables to store API data
  const [data, setData] = useState({
    totalStocksQuantity: 0,
    lowStocksQuantity: 0,
    expiredItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all stock data (optimized approach)
  const fetchStockData = async () => {
    try {
      // Fetch data from multiple APIs concurrently
      const [totalRes, lowRes, expiredRes] = await Promise.all([
        totalStocksAPI(),
        lowStocksAPI(),
        expiredItemsAPI(),
      ]);

      // Update state with fetched data
      setData({
        totalStocksQuantity: totalRes?.data?.result || 0,
        lowStocksQuantity: lowRes?.data?.result || 0,
        expiredItems: expiredRes?.data?.result?.total || 0,
      });
    } catch (err) {
      console.error("Error fetching stock data:", err);
    } finally {
      // Set loading state to false after data is fetched
      setIsLoading(false);
    }
  };

  // useEffect to call APIs on component mount
  useEffect(() => {
    fetchStockData();
  }, []);

  // Loader component to show while data is being fetched
  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" color="var(--primary)" />
      </Flex>
    );
  }

  // Render the dashboard
  return (
    <Flex direction="column" gap="20px" pt={{ base: "130px", md: "80px" }}>
      {/* Header section */}
      <Flex justifyContent="space-between" alignItems="center" fontWeight="500">
        <Text color="var(--primary)" fontSize={"28px"}>
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
          value={data.totalStocksQuantity}
          growth="+11.02%"
        />
        <DashboardCard
          color="#e27e35"
          bg="#ffdcbc"
          border="#ffebd8"
          label="Low Stock Alert"
          value={data.lowStocksQuantity}
          growth="-0.03%"
        />
        <DashboardCard
          color="#035d5d"
          bg="#9ef6f7"
          border="#d7f7f7"
          label="Expiry Alert"
          value={data.expiredItems}
          growth="+15.03%"
        />
      </SimpleGrid>

      {/* Total spent section */}
      <TotalSpent />

      {/* Additional charts section */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
        <DailyTraffic />
        <PieCard />
      </SimpleGrid>

      {/* Weekly revenue section */}
      {/* <WeeklyRevenue /> */}
    </Flex>
  );
}
