/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  // Avatar,
  // Box,
  Flex,
  // FormLabel,
  // Icon,
  // Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Assets
// import Usa from 'assets/img/dashboards/usa.png';
// Custom components
// import MiniCalendar from 'components/calendar/MiniCalendar';
// import MiniStatistics from 'components/card/MiniStatistics';
// import IconBox from 'components/icons/IconBox';
import React, { useEffect, useState } from 'react';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from 'react-icons/md';
// import CheckTable from './components/CheckTable.jsx';
// import ComplexTable from './components/ComplexTable.jsx';
import DailyTraffic from './components/DailyTraffic.jsx';
import PieCard from './components/PieCard.jsx';
// import Tasks from './components/Task.jsx';
import TotalSpent from './components/TotalSpent.jsx';
import WeeklyRevenue from './components/WeeklyRevenue.jsx';
import {
  columnsDataCheck,
  columnsDataComplex,
} from './variables/columnsData';
import tableDataCheck from './variables/tableDataCheck.json';
import tableDataComplex from './variables/tableDataComplex.json';
import DashboardCard from './components/Cards';
import { totalStocksAPI, lowStocksAPI, expiredItemsAPI } from '../../../api/index.js';
import { useDispatch } from 'react-redux';

export default function UserReports() {
  // Chakra Color Mode

  // const dispatch = useDispatch();
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const [totalStocksQuantity, setTotalStocksQuantity] = useState(0);
  const [lowStocksQuantity, setLowStocksQuantity] = useState(0);
  const [expiredItems, setExpiredItems] = useState(0);


  const TotalStocksQuantity = () => {
    totalStocksAPI().then((res) => {
      setTotalStocksQuantity(res?.data?.result)
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      console.log('API call completed')
    })
  }

  const LowStocksQuantity = () => {
    lowStocksAPI().then((res) => {
      setLowStocksQuantity(res?.data?.result)
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      console.log('API call completed for low stocks')
    })
  }

  const expiredQuantity = () => {
    expiredItemsAPI().then((res) => {
      setExpiredItems(res?.data?.result?.total)
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      console.log('API call completed for expired items')
    })
  }


  useEffect(() => {
    TotalStocksQuantity();
    LowStocksQuantity();
    expiredQuantity();
  }, [])




  return (
    <Flex
      direction="column"
      gap="20px"
      pt={{ base: '130px', md: '80px', xl: '80px' }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        color="var(--primary)"
        fontWeight="500"
      >
        <Text>Overview</Text>
        {/* <Text>Today</Text> */}
      </Flex>
      <SimpleGrid columns={{ md: 3, base: 1 }} gap="20px" mb="20px">
        <DashboardCard
          color="#e847a5"
          bg="#ffbbee"
          icon=""
          border="#fee1f9"
          label="Total Stock Quantity"
          value={totalStocksQuantity}
          growth="+11.02%"
        />
        <DashboardCard
          color="#e27e35"
          bg="#ffdcbc"
          icon=""
          border="#ffebd8"
          label="Low Stock Alert"
          value={lowStocksQuantity}
          growth="-0.03%"
        />
        <DashboardCard
          color="#035d5d"
          bg="#9ef6f7"
          icon=""
          border="#d7f7f7"
          label="Expirty Alert"
          value={expiredItems}
          growth="+15.03%"
        />
      </SimpleGrid>

      <TotalSpent />
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
        <DailyTraffic />
        <PieCard />
      </SimpleGrid>
      <WeeklyRevenue />
    </Flex>
  );
}
