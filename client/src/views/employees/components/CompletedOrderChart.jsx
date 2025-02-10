import { useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import {
  eachDayOfInterval,
  subDays,
  startOfToday,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";

export default function CompletedOrderChart({
  weeklyOrders,
  monthlyOrders,
  yearlyOrders,
  // totalTipsWeek,
  // totalTipsMonth,
  // totalTipsYear,
}) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    const today = startOfToday();

    // Weekly data preparation
    const pastWeekDates = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    }).map((date, index) => ({
      x: date.getTime(),
      y: weeklyOrders[index] || 0,
    }));

    // Monthly data preparation
    const pastMonthDates = eachDayOfInterval({
      start: subDays(today, 29),
      end: today,
    }).map((date, index) => ({
      x: date.getTime(),
      y: monthlyOrders[index] || 0,
    }));

    // Yearly data preparation
    const pastYearMonths = eachMonthOfInterval({
      start: subMonths(today, 11),
      end: today,
    }).map((date, index) => ({
      x: date.getTime(),
      y: yearlyOrders[index] || 0,
    }));

    setWeeklyData(pastWeekDates);
    setMonthlyData(pastMonthDates);
    setYearlyData(pastYearMonths);
  }, [weeklyOrders, monthlyOrders, yearlyOrders]);

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      zoom: { enabled: true },
    },
    xaxis: { type: "datetime" },
    yaxis: {
      title: { text: "Orders Served" },
      tickAmount: 3,
    },
    stroke: { curve: "smooth" },
    markers: { size: 4 },
    tooltip: { x: { format: "dd MMM yyyy" } },
  };

  return (
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
            series={[{ name: "Orders Served", data: weeklyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
        <TabPanel>
          <Chart
            options={chartOptions}
            series={[{ name: "Orders Served", data: monthlyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
        <TabPanel>
          <Chart
            options={chartOptions}
            series={[{ name: "Orders Served", data: yearlyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

CompletedOrderChart.propTypes = {
  weeklyOrders: PropTypes.array.isRequired,
  monthlyOrders: PropTypes.array.isRequired,
  yearlyOrders: PropTypes.array.isRequired,
};
