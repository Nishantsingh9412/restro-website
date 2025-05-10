import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = ({ chartData, chartOptions }) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    setData(chartData);
    setOptions({
      ...chartOptions,
      dataLabels: {
        enabled: false, // Disable labels
      },
    });
  }, [chartData, chartOptions]);

  return (
    <ReactApexChart
      options={options}
      series={data}
      type="pie"
      width="100%"
      height="100%"
    />
  );
};

export default PieChart;
