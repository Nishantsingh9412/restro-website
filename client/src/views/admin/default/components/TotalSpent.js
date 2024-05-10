// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import LineChart from 'components/charts/LineChart';
import React from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
// Assets
import { RiArrowUpSFill } from 'react-icons/ri';
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from 'variables/charts';

export default function TotalSpent(props) {
  const { ...rest } = props;

  // Chakra Color Mode

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
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
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      <Flex alignItems="center" gap="20px">
        <Text fontWeight="500">Total Cost Tracking</Text>
        <Text>|</Text>
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            marginInlineStart: '20px',
          }}
        >
          <li style={{ color: '#e379ba' }}>This year</li>
          <li style={{ color: '#d98d30' }}>Last year</li>
        </ul>
      </Flex>
      <Box minH="260px" minW="75%" mt="auto">
        <LineChart
          chartData={lineChartDataTotalSpent}
          chartOptions={lineChartOptionsTotalSpent}
        />
      </Box>
    </Card>
  );
}
