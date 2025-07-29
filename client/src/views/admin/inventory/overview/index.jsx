import { IoEllipsisVertical } from "react-icons/io5";

// import DashboardCard from "../../default/components/Cards.jsx";
import PieCard from "./components/PieCard.jsx";
// import QuickActionCard from "./components/QuickActionCard.jsx";
// import InventoryTableCard from "./components/TableCard.jsx";
// import HeatMapCard from "./components/HeatMapCard.jsx";
// import StockBarChart from "./components/StockBarCard.jsx";
import StockLevelLineChart from "./components/PriceChartCard.jsx";
import useInventoryDashBoard from "../../../../hooks/useInventoryDB.js";
import { PageHeading } from "../../../../components/UI/PageHeading.jsx";
import PageLoader from "../../../../components/UI/Loader.jsx";
import PrimaryActionButton from "../../../../components/UI/PrimaryActionButton.jsx";

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
        <section className="lg:flex space-x-2">
          {/* Stat Cards and Chart */}
          <div className="space-y-2 flex-2/5 ">
            {/* Stat Cards */}
            <div className="flex space-x-3 ">
              {/* Total Stocks */}
              <div className="bg-pink-300 p-2 rounded-md text-xl flex-1 ">
                <strong className="text-3xl">{allStockCount}</strong>
                <p className="text-sm">Total Stocks Quantity</p>
              </div>
              {/* Low Stock Alert */}
              <div className="bg-teal-300 p-2 rounded-md text-xl flex-1">
                <strong className="text-3xl">{lowStockCount} </strong>
                <p className="text-sm">Low Stocks Alert</p>
              </div>
              {/* Expiry Alert */}
              <div className="bg-purple-300 p-2 rounded-md text-xl flex-1">
                <strong className="text-3xl">{expiredCount}</strong>
                <p className="text-sm">Expiry Alert</p>
              </div>
              {/* Wasted Items This Month  */}
              <div className="bg-red-300 p-2 rounded-md text-xl flex-1">
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

              <StockLevelLineChart
                title="Stock Purchase Overview"
                stockData={charts.monthlyPurchasePrice}
              />
            </div>
          </div>
          {/* Pie Card */}
          <div className="!border !border-primary rounded-lg flex-1 p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div>
                <h3 className="!font-semibold">Total Stock Overview</h3>
                <p className="text-gray-500 text-sm">Based on Category</p>
                <PieCard
                  title="Total Stock Overview"
                  chartData={transformedChartData}
                />
              </div>
              <IoEllipsisVertical className="text-gray-500" />
            </div>
          </div>
        </section>

        {/* Stock Usage and Quick Action */}
        <section className="flex space-x-3">
          <div className="!border !border-blue-300 rounded-lg flex-2/4 p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div>
                <h3 className="!font-semibold">Monthly Stock In & Out</h3>
                <p className="text-gray-500 text-sm">Purchase and Usages</p>
              </div>
              <IoEllipsisVertical className="text-gray-500" />
            </div>
          </div>
          {/* Quick Action Card */}
          <div className="!border !border-yellow-300 rounded-lg flex-1 p-3 !space-y-3">
            <h3 className="!font-semibold">Quick Actions</h3>
            <PrimaryActionButton>Add New Item</PrimaryActionButton>
            <PrimaryActionButton>Scan Barcode</PrimaryActionButton>
            <PrimaryActionButton>
              View &nbsp;&nbsp;&nbsp;Reports&nbsp;&nbsp;&nbsp;
            </PrimaryActionButton>
            <PrimaryActionButton>
              Waste &nbsp;&nbsp;&nbsp;Entry&nbsp;&nbsp;&nbsp;
            </PrimaryActionButton>
          </div>
          <div className="!border !border-yellow-300 rounded-lg flex-2 p-3">
            <h3 className="!font-semibold">Daily Stock Usage</h3>
          </div>
        </section>

        {/* Action History */}
        {/* TABLE for Action History (Desktop) */}
        <div className="bg-white rounded-xl my-2 !border !border-gray-200 overflow-x-auto max-h-[75vh] hidden md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-primary text-white h-12 sticky top-0 z-10">
                <th className="py-2 px-8 text-left font-semibold border-b border-gray-300">
                  Date
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  Item Name
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  Action
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  Quantity
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  User
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No Action History
                  </td>
                </tr>
              ) : (
                tableData.map((entry) => (
                  <tr
                    key={entry._id}
                    className="even:bg-[#ebebfa] odd:bg-white"
                  >
                    <td className="py-3 px-8 text-gray-700">
                      {entry?.timestamp
                        ? new Date(entry.timestamp).toLocaleDateString("en-GB")
                        : "--"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {entry.itemName}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          entry.actionType === "added"
                            ? "bg-green-100 text-green-700"
                            : entry.actionType === "removed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {entry?.actionType[0]?.toUpperCase() +
                          entry?.actionType.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {entry.quantity}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {entry.userName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="flex flex-col gap-3 pt-8 md:pt-2 px-2 md:px-0">
        <PageHeading title={"Inventory Overview"} /> */}
      {/* <div className="flex justify-between items-center font-semibold mb-2">
        <h2 className="text-primary text-2xl md:text-3xl">Overview</h2>
      </div> */}

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
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
      </div> */}
    </>
  );
}
