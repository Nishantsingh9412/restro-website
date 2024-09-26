import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ColumnChart = ({ chartData, chartOptions }) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setData(chartData);
    setOptions(chartOptions);
  }, [chartData, chartOptions]);

  return (
    <Chart
      options={options}
      series={data}
      type="bar"
      width="100%"
      height="100%"
    />
  );
};

export default ColumnChart;
