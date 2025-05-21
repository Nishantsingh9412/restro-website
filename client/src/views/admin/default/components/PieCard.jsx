// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "../../../../components/card/Card.jsx";
import DonutChart from "../../../../components/charts/DonutChart";
import {
  donutChartData,
  donutChartOptions,
} from "../../../../variables/charts";

export default function PieCard(props) {
  const { totalPieChartData, ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Text me="auto" fontWeight="500" lineHeight="100%" color={textColor}>
        Supplier By Location
      </Text>

      <Flex alignItems="center" mt="20px" justifyContent="space-between">
        <DonutChart
          h="100%"
          w="100%"
          chartData={donutChartData}
          chartOptions={donutChartOptions}
        />

        <Flex direction="column" gap="10px">
          {totalPieChartData?.map((item, i) => (
            <Flex
              alignItems="center"
              gap="10px"
              justifyContent="space-between"
              key={i}
            >
              <Text>{item.location}</Text>
              <Text
                px="10px"
                py="5px"
                borderRadius="4px"
                color="#fff"
                bg={donutChartOptions.colors[i]}
              >
                {item.percentage}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}
