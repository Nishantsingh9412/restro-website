import DonutChart from "../../../../components/charts/DonutChart";
import {
  donutChartData,
  donutChartOptions,
} from "../../../../variables/charts";
// import { ChevronDown } from "lucide-react";

const totalPieChartData = [
  { location: "Berlin", percentage: "45%", color: "#1e90ff" },
  { location: "Hamburg", percentage: "29%", color: "#2ecc71" },
  { location: "Munich", percentage: "18%", color: "#9b59b6" },
  { location: "Cologne", percentage: "25%", color: "#f39c12" },
];

export default function PieCard() {
  return (
    <div className="   ">
      {/* Header */}
      {/* <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/de.png"
            alt="Germany"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-[#2d3748]">Germany</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div> */}

      {/* Donut Chart */}
      <div className="flex justify-center h-30">
        <DonutChart
          chartData={donutChartData}
          chartOptions={donutChartOptions}
        />
      </div>

      {/* Legend */}
      {totalPieChartData.map((item, i) => (
        <div key={i} className="flex items-center gap-3 px-12">
          <span className="text-[#656464] font-medium text-xs w-20">
            {item.location}
          </span>
          <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
            <div
              className="h-1 rounded-full absolute left-0 top-0"
              style={{
                width: item.percentage,
                backgroundColor: item.color,
              }}
            ></div>
          </div>
          <span
            className="text-sm font-semibold ml-3"
            style={{ color: item.color }}
          >
            {item.percentage}
          </span>
        </div>
      ))}
    </div>
  );
}
