import { useState } from "react";
import BarChart from "../../../../components/charts/BarChart";
import {
  barChartDataDailyUserActivity,
  barChartWeeklyUserActivity,
  barChartMonthlyUserActivity,
  barChartOptionsUserActivity,
} from "../../../../variables/charts";

export default function OrderData() {
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  // Get chart data based on selected period
  const getChartData = () => {
    switch (selectedPeriod) {
      case "Daily":
        return barChartDataDailyUserActivity;
      case "Weekly":
        return barChartWeeklyUserActivity;
      case "Monthly":
        return barChartMonthlyUserActivity;
      default:
        return barChartDataDailyUserActivity;
    }
  };

  // Get x-axis categories based on selected period
  const getXAxisCategories = () => {
    switch (selectedPeriod) {
      case "Daily":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      case "Weekly":
        return ["Week 1", "Week 2", "Week 3", "Week 4"];
      case "Monthly":
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
      default:
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
  };

  // Update chart options with dynamic x-axis labels
  const updatedChartOptions = {
    ...barChartOptionsUserActivity,
    xaxis: {
      ...barChartOptionsUserActivity.xaxis,
      categories: getXAxisCategories(),
    },
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-end w-full ">
        <select
          id="user_type"
          className="border border-gray-300 rounded px-3 py-1 bg-transparent text-gray-700 focus:outline-none"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="Weekly">Weekly</option>
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>
      <div className="h-[240px] w-full mt-auto">
        <BarChart
          chartData={getChartData()}
          chartOptions={updatedChartOptions}
        />
      </div>
    </div>
  );
}
