/* eslint-disable no-unused-vars */
// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card.jsx";
import { useEffect, useState } from "react";
import DonutChart from "../../../../components/charts/DonutChart";
import {
  donutChartData,
  donutChartOptions,
} from "../../../../variables/charts";
import { supplierLocationAPI } from "../../../../api/index.js";

export default function Conversion(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  // State to hold pie chart data
  const [totalPieChartData, setTotalPieChartData] = useState([]);

  // Fetch data from API
  const fetchTotalPieData = async () => {
    try {
      const res = await supplierLocationAPI();
      setTotalPieChartData(res?.data?.result);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTotalPieData();
  }, []);

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
          {totalPieChartData.map((item, i) => (
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
