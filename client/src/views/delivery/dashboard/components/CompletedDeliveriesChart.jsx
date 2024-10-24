import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Chart from "react-apexcharts";
import {
  eachDayOfInterval,
  subDays,
  startOfToday,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";

// Component to display completed deliveries chart
export default function CompletedDeliveriesChart({
  weekly = [],
  monthly = [],
  yearly = [],
}) {
  // State to store chart data
  const [chartData, setChartData] = useState({
    weeklyData: [],
    monthlyData: [],
    yearlyData: [],
  });

  // Get today's date
  const today = useMemo(() => startOfToday(), []);

  // Calculate past week dates and map them to the weekly data
  const pastWeekDates = useMemo(
    () =>
      eachDayOfInterval({
        start: subDays(today, 6),
        end: today,
      }).map((date, index) => ({
        x: date.getTime(),
        y: weekly[index] || 0,
      })),
    [today, weekly]
  );

  // Calculate past month dates and map them to the monthly data
  const pastMonthDates = useMemo(
    () =>
      eachDayOfInterval({
        start: subDays(today, 29),
        end: today,
      }).map((date, index) => ({
        x: date.getTime(),
        y: monthly[index] || 0,
      })),
    [today, monthly]
  );

  // Calculate past year months and map them to the yearly data
  const pastYearMonths = useMemo(
    () =>
      eachMonthOfInterval({
        start: subMonths(today, 11),
        end: today,
      }).map((date, index) => ({
        x: date.getTime(),
        y: yearly[index] || 0,
      })),
    [today, yearly]
  );

  // Update chart data when past dates change
  useEffect(() => {
    setChartData({
      weeklyData: pastWeekDates,
      monthlyData: pastMonthDates,
      yearlyData: pastYearMonths,
    });
  }, [pastWeekDates, pastMonthDates, pastYearMonths]);

  // Chart options configuration
  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      zoom: {
        enabled: true,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      title: {
        text: "Deliveries",
      },
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 4,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
  };

  return (
    // Tabs to switch between weekly, monthly, and yearly data
    <Tabs variant="enclosed">
      <TabList>
        <Tab>Last Week</Tab>
        <Tab>Last Month</Tab>
        <Tab>Last Year</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Chart
            options={chartOptions}
            series={[{ name: "Deliveries", data: chartData.weeklyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
        <TabPanel>
          <Chart
            options={chartOptions}
            series={[{ name: "Deliveries", data: chartData.monthlyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
        <TabPanel>
          <Chart
            options={chartOptions}
            series={[{ name: "Deliveries", data: chartData.yearlyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

// PropTypes validation
CompletedDeliveriesChart.propTypes = {
  weekly: PropTypes.array,
  monthly: PropTypes.array,
  yearly: PropTypes.array,
  totalInWeek: PropTypes.number.isRequired,
  totalInMonth: PropTypes.number.isRequired,
  totalInYear: PropTypes.number.isRequired,
};
