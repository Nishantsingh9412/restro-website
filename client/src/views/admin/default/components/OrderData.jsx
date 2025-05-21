// Chakra imports
import { Box, Flex, Select, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import Card from "../../../../components/card/Card.jsx";
// Custom components
import BarChart from "../../../../components/charts/BarChart";
import {
  barChartDataOrdersDaily,
  barChartDataOrdersWeekly,
  barChartDataOrdersMonthly,
  barChartOptionsOrders,
} from "../../../../variables/charts"; // Assume you have separate data for daily, weekly, and monthly orders

export default function OrdersChart(props) {
  const { ...rest } = props;

  // State to handle the selected period (Daily, Weekly, Monthly)
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // Function to get the correct data based on the selected period
  const getChartData = () => {
    switch (selectedPeriod) {
      case "Daily":
        return barChartDataOrdersDaily;
      case "Weekly":
        return barChartDataOrdersWeekly;
      case "Monthly":
        return barChartDataOrdersMonthly;
      default:
        return barChartDataOrdersWeekly; // Default to weekly
    }
  };

  // Function to get the correct X-axis categories based on the selected period
  const getXAxisCategories = () => {
    switch (selectedPeriod) {
      case "Daily":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Days of the week
      case "Weekly":
        return ["Week 1", "Week 2", "Week 3", "Week 4"]; // Weeks
      case "Monthly":
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; // Months
      default:
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }
  };

  // Update the chart options with dynamic x-axis labels
  const updatedChartOptions = {
    ...barChartOptionsOrders,
    xaxis: {
      ...barChartOptionsOrders.xaxis,
      categories: getXAxisCategories(),
    },
  };

  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="lg"
          fontWeight="500"
          lineHeight="100%"
        >
          Orders Data
        </Text>
        <Select
          id="orders_type"
          w="unset"
          variant="transparent"
          display="flex"
          alignItems="center"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)} // Handle change
        >
          <option value="Weekly">Weekly</option>
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
        </Select>
      </Flex>

      <Box h="240px" mt="auto">
        <BarChart
          chartData={getChartData()} // Get the correct chart data
          chartOptions={updatedChartOptions} // Pass the updated options with dynamic X-axis
        />
      </Box>
    </Card>
  );
}
