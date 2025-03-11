import { useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Chart from "react-apexcharts";
import {
  eachDayOfInterval,
  subDays,
  startOfToday,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";
import PropTypes from "prop-types";

export default function CompletedDeliveriesChart({ weekly, monthly, yearly }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    // Calculate dynamic date ranges
    const today = startOfToday();

    // Prepare past week dates and fill in the data from props
    const pastWeekDates = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    }).map((date, index) => ({
      x: date.getTime(),
      y: weekly[index] || 0, // Use data from props or 0 if not available
    }));

    // Prepare past month dates and fill in the data from props
    const pastMonthDates = eachDayOfInterval({
      start: subDays(today, 29),
      end: today,
    }).map((date, index) => ({
      x: date.getTime(),
      y: monthly[index] || 0, // Use data from props or 0 if not available
    }));

    // Prepare past year months and fill in the data from props
    const pastYearMonths = eachMonthOfInterval({
      start: subMonths(today, 11),
      end: today,
    }).map((date, index) => ({
      x: date.getTime(),
      y: yearly[index] || 0, // Use data from props or 0 if not available
    }));

    setWeeklyData(pastWeekDates);
    setMonthlyData(pastMonthDates);
    setYearlyData(pastYearMonths);
  }, [weekly, monthly, yearly]);

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
      tickAmount: 3,
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
            series={[{ name: "Deliveries", data: weeklyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
        <TabPanel>
          <Chart
            options={chartOptions}
            series={[{ name: "Deliveries", data: monthlyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
        <TabPanel>
          <Chart
            options={chartOptions}
            series={[{ name: "Deliveries", data: yearlyData }]}
            type="area"
            height={350}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

CompletedDeliveriesChart.propTypes = {
  weekly: PropTypes.array.isRequired,
  monthly: PropTypes.array.isRequired,
  yearly: PropTypes.array.isRequired,
};
