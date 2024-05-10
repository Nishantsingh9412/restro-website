// Chakra imports
import {  Flex, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import React from 'react';
import DonutChart from 'components/charts/DonutChart';
import { donutChartData } from 'variables/charts';
import { donutChartOptions } from 'variables/charts';

export default function Conversion(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardColor = useColorModeValue('white', 'navy.700');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset'
  );
  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
        Suppliers by Location
      </Text>

      <Flex alignItems="center" mt="20px" justifyContent="space-between">
        <DonutChart
          h="100%"
          w="100%"
          chartData={donutChartData}
          chartOptions={donutChartOptions}
        />
        <Flex direction="column" gap="10px">
          {donutChartOptions.labels.map((item, i) => (
            <Flex alignItems="center" gap="10px" justifyContent="space-between" key={i}>
              <Text>{item}</Text>
              <Text
                px="10px"
                py="5px"
                borderRadius="4px"
                color="#fff"
                bg={donutChartOptions.colors[i]}
              >
                {donutChartData[i] + '%'}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}
