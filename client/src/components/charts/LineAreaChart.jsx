import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";

const LineChart = ({ chartData, chartOptions }) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setData(chartData);
    setOptions(chartOptions);
  }, [chartData, chartOptions]);

  return (
    <ReactApexChart
      options={options}
      series={data}
      type="area"
      width="100%"
      height="100%"
    />
  );
};
LineChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  chartOptions: PropTypes.object.isRequired,
};

export default LineChart;
