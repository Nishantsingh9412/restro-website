import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const DonutChart = ({ chartData, chartOptions }) => {
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
      type="donut"
      width="100%"
      height="100%"
    />
  );
};

export default DonutChart;
