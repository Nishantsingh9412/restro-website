// Chakra imports
import { Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { IoAlert } from "react-icons/io5";
import { IoMdAlert } from "react-icons/io";
import { MdCrisisAlert, MdInventory } from "react-icons/md";
import { getInventoryDashboardData } from "../../../api/index.js";
import DashboardCard from "../default/components/Cards";
import PieCard from "./components/PieCard.jsx";
import QuickActionCard from "./components/QuickActionCard.jsx";
// import SuggestionCard from "./components/SuggestionCard.jsx";
import InventoryTableCard from "./components/TableCard.jsx";
import HeatMapCard from "./components/HeatMapCard.jsx";
import StockBarChart from "./components/StockBarCard.jsx";
import StockLevelLineChart from "./components/PriceChartCard.jsx";

export default function AdminDashboard() {
  // State variables to store API data
  const [dashboardData, setDashboardData] = useState({
    inventoryItems: [],
    expiredCount: 0,
    lowStockCount: 0,
    upcomingExpiry: 0,
    charts: {
      dailyUsage: [],
      monthlyStockData: [],
      monthlyPurchasePrice: [],
    },
    tableData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Destructure dashboard data
  const { inventoryItems, expiredCount, lowStockCount, upcomingExpiry } =
    dashboardData;

  // Calculate total stock count and price using useMemo
  const { allStockCount, allStockPrice } = useMemo(() => {
    return inventoryItems.reduce(
      (acc, { availableQuantity, price = 0 }) => {
        acc.allStockCount += availableQuantity;
        acc.allStockPrice += availableQuantity * price;
        return acc;
      },
      { allStockCount: 0, allStockPrice: 0 }
    );
  }, [inventoryItems]);

  // Transform data for pie chart
  const transformedChartData = inventoryItems?.reduce(
    (acc, item) => {
      acc.data.push(item?.availableQuantity);
      acc.options.labels.push(item?.itemName);
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
          inventoryItems = [],
          expiredCount = 0,
          lowStockCount = 0,
          upcomingExpiry = 0,
          charts = {},
          recentActions = [],
        } = response.data.result;

        setDashboardData({
          inventoryItems,
          expiredCount,
          lowStockCount,
          upcomingExpiry,
          charts: {
            dailyUsage: charts?.dailyUsage || [],
            monthlyStockData: charts?.monthlyStockData || [],
            monthlyPurchasePrice: charts?.monthlyPurchasePrice || [],
          },
          tableData: recentActions,
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
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap="10px" mb="10px">
        <DashboardCard
          color="#e847a5"
          bg="#ffbbee"
          border="#fee1f9"
          label="Total Stock Quantity"
          value={allStockCount}
          icon={MdInventory}
          growth={allStockPrice}
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
      <StockLevelLineChart
        title="Stock Purchase Overview"
        stockData={dashboardData.charts.monthlyPurchasePrice}
      />
      <Flex
        gap="10px"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <PieCard
          title="Total Stock Overview"
          chartData={transformedChartData}
        />
        <HeatMapCard
          title="Daily Stock Usage"
          chartData={dashboardData.charts.dailyUsage}
        />
      </Flex>

      <Flex
        gap="10px"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <StockBarChart
          title="Stock"
          stockData={dashboardData.charts.monthlyStockData}
        />
        <QuickActionCard />
      </Flex>

      <InventoryTableCard tableData={dashboardData.tableData} />
    </Flex>
  );
}
