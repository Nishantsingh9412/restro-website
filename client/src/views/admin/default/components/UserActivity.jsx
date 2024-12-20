// TODO: Delete this file
// Chakra imports
import { Box, Flex, Select, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "../../../../components/card/Card.jsx";
import { useState } from "react";
// Custom components
import BarChart from "../../../../components/charts/BarChart";
import {
  barChartDataDailyUserActivity,
  barChartWeeklyUserActivity,
  barChartMonthlyUserActivity,
  barChartOptionsUserActivity,
} from "../../../../variables/charts";

export default function UserActivity(props) {
  const { ...rest } = props;

  // State to handle the selected period (Daily, Weekly, Monthly)
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // Function to get the correct data based on the selected period
  const getChartData = () => {
    switch (selectedPeriod) {
      case "Daily":
        return barChartDataDailyUserActivity;
      case "Weekly":
        return barChartWeeklyUserActivity;
      case "Monthly":
        return barChartMonthlyUserActivity;
      default:
        return barChartDataDailyUserActivity; // Default to weekly
    }
  };

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
    ...barChartOptionsUserActivity,
    xaxis: {
      ...barChartOptionsUserActivity.xaxis,
      categories: getXAxisCategories(),
    },
  };
  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          User Activity
        </Text>
        <Select
          id="user_type"
          w="unset"
          variant="transparent"
          display="flex"
          alignItems="center"
          defaultValue="Weekly"
          onChange={(e) => setSelectedPeriod(e.target.value)} // Handle change
        >
          <option value="Weekly">Weekly</option>
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
        </Select>
      </Flex>

      <Box h="240px" mt="auto">
        <BarChart
          chartData={getChartData()}
          chartOptions={updatedChartOptions}
        />
      </Box>
    </Card>
  );
}
