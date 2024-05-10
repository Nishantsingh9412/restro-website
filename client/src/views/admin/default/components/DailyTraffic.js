import React from 'react';

// Chakra imports
import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import BarChart from 'components/charts/BarChart';

// Custom components
import Card from 'components/card/Card.js';
import {
  barChartDataDailyTraffic,
  barChartOptionsDailyTraffic,
} from 'variables/charts';

// Assets
import { RiArrowUpSFill } from 'react-icons/ri';
import { barChartDataDemandedItems } from 'variables/charts';

export default function DailyTraffic(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Text me="auto" fontWeight="500" lineHeight="100%">
        Most Demanded Items
      </Text>
      <Box h="240px" mt="auto">
        <BarChart
          chartData={barChartDataDemandedItems}
          chartOptions={barChartOptionsDailyTraffic}
        />
      </Box>
    </Card>
  );
}
