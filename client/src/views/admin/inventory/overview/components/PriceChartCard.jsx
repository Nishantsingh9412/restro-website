import PropTypes from "prop-types";
import LineChart from "../../../../../components/charts/LineChart";

const PriceLineChartCard = ({ stockData }) => {
  // ApexChart config
  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 1.5 },
    xaxis: {
      categories: stockData?.map((item) => item.month),
    },
    yaxis: {
      labels: {
        formatter: (val) => `€${val}`,
      },
    },
    fill: { opacity: 1 },
    colors: ["#019cff"],
    legend: { position: "top" },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val) => `€${val}`,
      },
    },
  };

  const series = [
    {
      data: stockData?.map((item) => item.purchasePrice), // <-- Use your price field here
    },
  ];

  return (
    <div className="h-[250px]">
      {series?.length === 0 ? (
        <div>
          <h2>No Data Available</h2>
        </div>
      ) : (
        <LineChart chartData={series} chartOptions={options} />
      )}
    </div>
  );
};

PriceLineChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  stockData: PropTypes.array.isRequired,
};

export default PriceLineChartCard;
