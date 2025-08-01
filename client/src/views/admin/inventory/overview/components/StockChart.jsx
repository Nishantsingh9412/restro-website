import PropTypes from "prop-types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function StockChart({ chartData }) {
  const COLORS = [
    "#a78bfa", // purple
    "#7dd3fc", // blue
    "#fca5a5", // red
    "#fde047", // yellow
    "#c084fc",
    "#60a5fa",
    "#f87171",
    "#facc15",
    "#34d399",
    "#fb923c",
  ];

  return (
    <div className="bg-white text-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData.data}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {chartData.data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="px-2 mt-5 max-h-24 overflow-x-auto">
        {chartData.data.map((item, index) => (
          <div key={index} className="flex justify-between space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span>{item.name}</span>
            </div>
            <div>
              {item.value} {item.unit === "Piece" ? "pc" : item.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

StockChart.propTypes = {
  chartData: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};
