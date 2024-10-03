import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

// eslint-disable-next-line react/prop-types
const DonutChart = ({ chartData, chartOptions }) => {
  // State to hold chart data and options
  const [data, setData] = useState(chartData);
  const [options, setOptions] = useState(chartOptions);

  // Update state when props change
  useEffect(() => {
    setData(chartData);
    setOptions(chartOptions);
  }, [chartData, chartOptions]);

  return (
    <ReactApexChart
      options={options}
      series={data}
      type="donut"
      width="40%"
      height="100%"
    />
  );
};

export default DonutChart;
