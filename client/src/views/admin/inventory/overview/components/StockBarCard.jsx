import PropTypes from "prop-types";
import BarChart from "../../../../../components/charts/BarChart";

const StockBarChartCard = ({ stockData }) => {
  const options = {
    chart: {
      type: "bar",
      stacked: false, // ❗️DISABLE stacking
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: stockData?.map((item) => item.month),
      // title: {
      //   text: "Month",
      // },
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      // title: {
      //   text: "Stock In & Out",
      // },
      labels: {
        formatter: (val) => `€${val}`,
      },
    },
    fill: {
      opacity: 1,
      type: "gradient", // Optional: for a modern gradient look
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 1,
        stops: [0, 90, 100],
      },
    },
    colors: ["#6366F1", "#F97316"], // Purple for Purchase, Orange for Usage
    legend: {
      position: "top",
      horizontalAlign: "right",
      markers: {
        radius: 12,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `€${val}`,
      },
    },
    grid: {
      strokeDashArray: 5,
    },
  };

  const series = [
    {
      name: "Purchase",
      data: stockData?.map((item) => item.purchase),
    },
    {
      name: "Usage",
      data: stockData?.map((item) => item.usage),
    },
  ];

  return (
    <div className=" ">
      {stockData?.length === 0 ? (
        <div className="flex items-center justify-center h-44 w-full">
          <span className="text-gray-500 text-base">No Data Available</span>
        </div>
      ) : (
        <div className="h-[250px] w-full">
          <BarChart chartData={series} chartOptions={options} />
        </div>
      )}
    </div>
  );
};

StockBarChartCard.propTypes = {
  stockData: PropTypes.array.isRequired,
};

export default StockBarChartCard;
