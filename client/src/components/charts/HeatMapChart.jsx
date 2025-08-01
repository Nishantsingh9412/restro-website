import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { COLOR_SCALE } from "../../utils/constant";

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getStartDayOffset = (year, month) => {
  return new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
};

const CalendarHeatmap = ({ chartData }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const usageMap = useMemo(() => {
    const map = {};
    chartData.forEach((entry) => {
      map[entry.date] = entry.usage;
    });
    return map;
  }, [chartData]);

  const daysInMonth = getDaysInMonth(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth()
  );
  const offset = getStartDayOffset(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth()
  );

  const formatDate = (day) => {
    const yyyy = selectedMonth.getFullYear();
    const mm = String(selectedMonth.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getColorClass = (usage) => {
    if (usage > 20) return "bg-indigo-600 text-white";
    if (usage > 0) return "bg-indigo-100 text-indigo-900";
    return "";
  };

  const goToPrevMonth = () =>
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goToNextMonth = () =>
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  return (
    <>
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between mt-1">
          <span className="text-md !font-semibold text-gray-600">
            {selectedMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <div className="flex gap-1">
            <button
              className="w-8 h-8 rounded-md !border !border-gray-300 bg-white flex items-center justify-center hover:!bg-gray-100"
              onClick={goToPrevMonth}
            >
              &larr;
            </button>
            <button
              className="w-8 h-8 rounded-md !border !border-gray-300 bg-white flex items-center justify-center hover:!bg-gray-100"
              onClick={goToNextMonth}
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
        {[...Array(offset)].map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day);
          const usage = usageMap[dateStr] || 0;
          const colorClass = getColorClass(usage);

          return (
            <div
              key={dateStr}
              className={`w-8 h-8 rounded-md flex items-center justify-center ${colorClass}`}
              title={`Day ${day}: ${usage} used`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </>
  );
};
// Prop types for MonthlyCalendarHeatmap
CalendarHeatmap.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      usage: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CalendarHeatmap;
