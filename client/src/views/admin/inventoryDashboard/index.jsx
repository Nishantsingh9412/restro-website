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

// ✅ Mock Monthly Stock Data
const stockData = [
  { month: "Jan", purchase: 120, usage: 80 },
  { month: "Feb", purchase: 90, usage: 95 },
  { month: "Mar", purchase: 150, usage: 110 },
  { month: "Apr", purchase: 100, usage: 60 },
  { month: "May", purchase: 130, usage: 10 },
  { month: "Jun", purchase: 13, usage: 120 },
  { month: "Jul", purchase: 100, usage: 120 },
  { month: "Aug", purchase: 130, usage: 120 },
  { month: "Sep", purchase: 10, usage: 120 },
  { month: "Oct", purchase: 60, usage: 12 },
  { month: "Nov", purchase: 30, usage: 60 },
  { month: "Dec", purchase: 130, usage: 10 },
];
const stockPurchaseData = [
  { month: "Jan", purchase: 120, purchasePrice: 24000 },
  { month: "Feb", purchase: 90, purchasePrice: 18000 },
  { month: "Mar", purchase: 150, purchasePrice: 30000 },
  { month: "Apr", purchase: 110, purchasePrice: 22000 },
  { month: "May", purchase: 130, purchasePrice: 26000 },
  { month: "Jun", purchase: 100, purchasePrice: 20000 },
  { month: "Jul", purchase: 140, purchasePrice: 28000 },
  { month: "Aug", purchase: 95, purchasePrice: 19000 },
  { month: "Sep", purchase: 125, purchasePrice: 25000 },
  { month: "Oct", purchase: 105, purchasePrice: 21000 },
  { month: "Nov", purchase: 135, purchasePrice: 27000 },
  { month: "Dec", purchase: 115, purchasePrice: 23000 },
];

// Mock data: could be fetched from API
const mockUsage = [
  { date: "2025-05-01", usage: 1 },
  { date: "2025-05-02", usage: 5 },
  { date: "2025-05-03", usage: 15 },
  { date: "2025-05-04", usage: 0 },
  { date: "2025-05-05", usage: 10 },
  { date: "2025-05-06", usage: 20 },
  { date: "2025-05-07", usage: 7 },
  // ... fill for whole month
];
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

  // Calculate total stock count and price using useMemo
  const { allStockCount, allStockPrice } = useMemo(() => {
    return items.reduce(
      (acc, { availableQuantity, price = 0 }) => {
        acc.allStockCount += availableQuantity;
        acc.allStockPrice += availableQuantity * price;
        return acc;
      },
      { allStockCount: 0, allStockPrice: 0 }
    );
  }, [items]);

  // Transform data for pie chart
  const transformedChartData = items?.reduce(
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
        stockData={stockPurchaseData}
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
        <HeatMapCard title="Daily Stock Usage" chartData={mockUsage} />
      </Flex>

      <Flex
        gap="10px"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <StockBarChart title="Stock" stockData={stockData} />
        <QuickActionCard />
      </Flex>

      <InventoryTableCard tableData={items} />
    </Flex>
  );
}
