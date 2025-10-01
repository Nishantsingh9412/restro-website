import PropTypes from "prop-types";
import MonthlyCalendarHeatmap from "../../../../../components/charts/HeatMapChart";

const HeatMapCard = ({ chartData }) => {
  return (
    <div className="min-h-[250px] flex flex-col">
      {!chartData || chartData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center h-40">
          <span className="text-gray-500 text-base text-center">
            No Data Available
          </span>
        </div>
      ) : (
        <div>
          <MonthlyCalendarHeatmap chartData={chartData} />
        </div>
      )}
    </div>
  );
};

HeatMapCard.propTypes = {
  title: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default HeatMapCard;
