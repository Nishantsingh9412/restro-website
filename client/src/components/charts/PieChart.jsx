import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = ({ chartData, chartOptions }) => {
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
      type="pie"
      width="100%"
      height="55%"
    />
  );
};

export default PieChart;
