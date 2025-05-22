import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";

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
DonutChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  chartOptions: PropTypes.object.isRequired,
};

export default DonutChart;
