// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from '../../../../components/card/Card.jsx';
// Custom components
import BarChart from '../../../../components/charts/BarChart';
import React from 'react';
import {
  barChartDataConsumption,
  barChartOptionsConsumption,
} from '../../../../variables/charts';
import { MdBarChart } from 'react-icons/md';
import { barChartDataDailyTraffic } from '../../../../variables/charts';
import { barChartOptionsDailyTraffic } from '../../../../variables/charts';

export default function WeeklyRevenue(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const bgHover = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.50' }
  );
  const bgFocus = useColorModeValue(
    { bg: 'secondaryGray.300' },
    { bg: 'whiteAlpha.100' }
  );
  return (
    // <Card direction="column" w="100%" {...rest}>
    //   <Text fontSize="14px" mb="10px">This Week</Text>
    //   <Text
    //     me="auto"
    //     color={textColor}
    //     fontWeight="500"
    //   >
    //     Waste Tracking
    //   </Text>

    //   <Box h="240px" mt="auto">
    //     <BarChart
    //       chartData={barChartDataDailyTraffic}
    //       chartOptions={barChartOptionsDailyTraffic}
    //     />
    //   </Box>
    // </Card>
    <>
    </>
  );
}
