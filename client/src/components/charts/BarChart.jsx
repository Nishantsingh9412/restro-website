import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";

const ColumnChart = ({ chartData, chartOptions }) => {
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
      type="bar"
      width={"100%"}
      height="100%"
    />
  );
};
ColumnChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  chartOptions: PropTypes.object.isRequired,
};

export default ColumnChart;
