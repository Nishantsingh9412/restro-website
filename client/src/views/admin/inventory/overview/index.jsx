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
import { PageHeading } from "../../../../components/UI/PageHeading.jsx";

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
  } = useInventoryDashBoard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pt-8 md:pt-2 px-2 md:px-0">
      <PageHeading title={"Inventory Overview"} />
      {/* <div className="flex justify-between items-center font-semibold mb-2">
        <h2 className="text-primary text-2xl md:text-3xl">Overview</h2>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
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
      </div>

      <div className="mb-3">
        <StockLevelLineChart
          title="Stock Purchase Overview"
          stockData={charts.monthlyPurchasePrice}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="flex-1">
          <PieCard
            title="Total Stock Overview"
            chartData={transformedChartData}
          />
        </div>
        <div className="flex-1">
          <HeatMapCard
            title="Daily Stock Usage"
            chartData={charts.dailyUsage}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="flex-1">
          <StockBarChart title="Stock" stockData={charts.monthlyStockData} />
        </div>
        <div className="flex-1">
          <QuickActionCard />
        </div>
      </div>

      <div className="mt-3">
        <InventoryTableCard tableData={tableData} />
      </div>
    </div>
  );
}
