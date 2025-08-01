import LineChart from "../../../../components/charts/LineChart";

export default function InventoryTrackingChart() {
  const lineChartDataTotalSpent = [
    {
      name: "This Year",
      data: [
        12000, 13500, 12800, 14200, 13000, 14500, 13200, 14800, 13400, 15000,
        13600, 15200,
      ],
    },
    {
      name: "Last Year",
      data: [
        12500, 13000, 13800, 13200, 14000, 13400, 14200, 13600, 14400, 13800,
        14600, 14000,
      ],
    },
  ];
  const lineChartOptionsTotalSpent = {
    chart: {
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
    },
    colors: ["#A700FF", "#EF4444"],
    markers: {
      size: 0,
      colors: "white",
      strokeColors: "#7551FF",
      strokeWidth: 3,
      strokeOpacity: 0.9,
      fillOpacity: 1,
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    stroke: {
      width: [3, 3],
      dashArray: [0, 0],
      curve: ["smooth", "smooth"],
    },
    tooltip: { theme: "dark" },
    dataLabels: { enabled: false },
    xaxis: {
      type: "numeric",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#6D758DFF",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { type: "numeric" },
    legend: { show: true },
    grid: {
      show: false,
    },
  };

  return (
    <div className="h-[240px] w-full mt-auto">
      <LineChart
        chartData={lineChartDataTotalSpent}
        chartOptions={lineChartOptionsTotalSpent}
      />
    </div>
  );
}
