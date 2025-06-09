import { Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { IoAlert } from "react-icons/io5";
import { IoMdAlert } from "react-icons/io";
import { MdCrisisAlert, MdInventory } from "react-icons/md";
import DashboardCard from "../../default/components/Cards.jsx";
import PieCard from "./components/PieCard.jsx";
import QuickActionCard from "./components/QuickActionCard.jsx";
import InventoryTableCard from "./components/TableCard.jsx";
import HeatMapCard from "./components/HeatMapCard.jsx";
import StockBarChart from "./components/StockBarCard.jsx";
import StockLevelLineChart from "./components/PriceChartCard.jsx";
import useInventoryDashBoard from "../../../../hooks/useInventoryDB.js";

export default function InventoryDashboard() {
  const {
    isLoading,
    allStockCount,
    expiredCount,
    lowStockCount,
    upcomingExpiry,
    transformedChartData,
    charts,
    tableData,
  } = useInventoryDashBoard(); // ✅ Custom hook usage

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" color="var(--primary)" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="10px" pt={{ base: "130px", md: "10px" }}>
      <Flex justifyContent="space-between" alignItems="center" fontWeight="500">
        <Text color="var(--primary)" fontSize={{ base: "20px", md: "28px" }}>
          Overview
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap="10px" mb="10px">
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

      <StockLevelLineChart
        title="Stock Purchase Overview"
        stockData={charts.monthlyPurchasePrice}
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
        <HeatMapCard title="Daily Stock Usage" chartData={charts.dailyUsage} />
      </Flex>

      <Flex
        gap="10px"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <StockBarChart title="Stock" stockData={charts.monthlyStockData} />
        <QuickActionCard />
      </Flex>

      <InventoryTableCard tableData={tableData} />
    </Flex>
  );
}
