// Chakra imports
import { Box, Flex, Text } from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card";
import LineChart from "../../../../components/charts/LineChart";
// Assets
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "../../../../variables/charts";

export default function TotalSpent(props) {
  const { ...rest } = props;

  return (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      {/* Header Section */}
      <Flex alignItems="center" gap="20px">
        <Text fontWeight="500">Total Inventory Tracking</Text>
        <Text>|</Text>
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            marginInlineStart: "20px",
          }}
        >
          <li style={{ color: "#e379ba" }}>This year</li>
          <li style={{ color: "#d98d30" }}>Last year</li>
        </ul>
      </Flex>

      {/* Chart Section */}
      <Box minH="260px" minW="75%" mt="auto">
        <LineChart
          chartData={lineChartDataTotalSpent}
          chartOptions={lineChartOptionsTotalSpent}
        />
      </Box>
    </Card>
  );
}
