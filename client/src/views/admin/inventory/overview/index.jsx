import { IoEllipsisVertical } from "react-icons/io5";

import StockChart from "./components/StockChart.jsx";
import StockLevelLineChart from "./components/PriceChartCard.jsx";
import useInventoryDashBoard from "../../../../hooks/useInventoryDB.js";
import { PageHeading } from "../../../../components/UI/PageHeading.jsx";
import PageLoader from "../../../../components/UI/Loader.jsx";
import StockBarChartCard from "./components/StockBarCard.jsx";
import QuickActionCard from "./components/QuickActionCard.jsx";
import TableCard from "./components/TableCard.jsx";
import HeatMapCard from "./components/HeatMapCard.jsx";

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
    return <PageLoader />;
  }

  return (
    <>
      <PageHeading title={"Inventory Overview"} />
      <div className="mt-5 px-2 w-full space-y-3">
        <section className="lg:flex lg:space-x-2 space-y-3 lg:space-y-0">
          {/* Stat Cards and Chart */}
          <div className="space-y-2 lg:flex-2/5">
            <div className="flex flex-wrap gap-3 md:flex-nowrap">
              {/* Total Stocks */}
              <div className="bg-pink-300 p-2 rounded-md text-xl md:w-full w-[48%] lg:flex-1">
                <strong className="text-3xl">{allStockCount}</strong>
                <p className="text-sm">Total Stocks Quantity</p>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-teal-300 p-2 rounded-md text-xl md:w-full w-[48%] lg:flex-1">
                <strong className="text-3xl">{lowStockCount}</strong>
                <p className="text-sm">Low Stocks Alert</p>
              </div>

              {/* Expiry Alert */}
              <div className="bg-purple-300 p-2 rounded-md text-xl md:w-full w-[48%] lg:flex-1">
                <strong className="text-3xl">{expiredCount}</strong>
                <p className="text-sm">Expiry Alert</p>
              </div>

              {/* Wasted Items This Month */}
              <div className="bg-red-300 p-2 rounded-md text-xl md:w-full w-[48%] lg:flex-1">
                <strong className="text-3xl">{upcomingExpiry}</strong>
                <p className="text-sm">Wasted Items (Month)</p>
              </div>
            </div>

            {/* Chart  */}
            <div className="!border !border-blue-300 rounded-lg p-3">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h3 className="!font-semibold">Stock Purchase Overview</h3>
                  <p className="text-gray-500 text-sm">Income and Expenses</p>
                </div>
                <IoEllipsisVertical className="text-gray-500" />
              </div>
              <StockLevelLineChart stockData={charts.monthlyPurchasePrice} />
            </div>
          </div>
          {/* Pie Card */}
          <div className="!border !border-primary rounded-lg flex-1 p-3">
            <div className="flex justify-between items-baseline mb-5">
              <div>
                <h3 className="!font-semibold">Total Stock Overview</h3>
                <p className="text-gray-500 text-sm">Based on Category</p>
              </div>
              <IoEllipsisVertical className="text-gray-500" />
            </div>
            <StockChart chartData={transformedChartData} />
          </div>
        </section>

        {/* Stock Monthly, Daily Usage and Quick Action */}
        <section className="lg:flex lg:space-x-3 space-y-3 lg:space-y-0">
          <div className="!border !border-blue-300 rounded-lg flex-2/4 p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div>
                <h3 className="!font-semibold">Monthly Stock In & Out</h3>
                <p className="text-gray-500 text-sm">Purchase and Usages</p>
              </div>
              <IoEllipsisVertical className="text-gray-500" />
            </div>
            <StockBarChartCard stockData={charts.monthlyStockData} />
          </div>
          {/* Quick Action Card */}
          <QuickActionCard />
          {/* Stock Heatmap */}
          <div className="!border !border-yellow-300 rounded-lg flex-2 p-3">
            <h3 className="!font-semibold">Daily Stock Usage</h3>
            <HeatMapCard chartData={charts.dailyUsage} />
          </div>
        </section>
        {/* TABLE for Action History (Desktop) */}
        <TableCard tableData={tableData} />
      </div>
    </>
  );
}
