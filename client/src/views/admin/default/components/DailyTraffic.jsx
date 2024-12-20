import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import BarChart from "../../../../components/charts/BarChart";
import Card from "../../../../components/card/Card.jsx";
import {
  barChartDataDemandedItems,
  barChartOptionsDailyTraffic,
} from "../../../../variables/charts";

export default function DailyTraffic(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      {/* Title */}
      <Text me="auto" fontWeight="500" lineHeight="100%" color={textColor}>
        Most Demanded Items
      </Text>
      {/* Bar Chart */}
      <Box h="240px" mt="auto">
        <BarChart
          chartData={barChartDataDemandedItems}
          chartOptions={barChartOptionsDailyTraffic}
        />
      </Box>
    </Card>
  );
}
