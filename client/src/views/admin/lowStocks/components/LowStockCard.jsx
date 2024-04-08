import { Box, Circle, Container, Flex, Stack, Text } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import React, { useEffect } from 'react'
import { LuSoup } from 'react-icons/lu'
import { useSelector } from 'react-redux'

import { getLowStocksAction, getAllStocksAction } from '../../../../redux/action/stocks'


const LowStockCard = () => {

    const dispatch = useDispatch();

    const data = [
        { name: 'Basmati Rice', lastUpdated: '12-02-2024', totalAmount: '36/45', percentage: '89%', isLowStock: true },
        { name: 'Brown Rice', lastUpdated: '12-02-2024', totalAmount: '20/45', percentage: '44%', isLowStock: true },
        { name: 'Jasmine Rice', lastUpdated: '15-03-2024', totalAmount: '28/45', percentage: '62%', isLowStock: true }
        // Add more items as needed
    ];

    const data2 = [
        { name: 'Basmati Rice', lastUpdated: '12-02-2024', totalAmount: '36/45', percentage: '89%', isLowStock: false },
        { name: 'Brown Rice', lastUpdated: '12-02-2024', totalAmount: '20/45', percentage: '44%', isLowStock: false },
        { name: 'Jasmine Rice', lastUpdated: '15-03-2024', totalAmount: '28/45', percentage: '62%', isLowStock: false },
        { name: 'Jasmine Rice', lastUpdated: '15-03-2024', totalAmount: '28/45', percentage: '62%', isLowStock: false },
        { name: 'Jasmine Rice', lastUpdated: '15-03-2024', totalAmount: '28/45', percentage: '62%', isLowStock: false },
        { name: 'Jasmine Rice', lastUpdated: '15-03-2024', totalAmount: '28/45', percentage: '62%', isLowStock: false },
        { name: 'Jasmine Rice', lastUpdated: '15-03-2024', totalAmount: '28/45', percentage: '62%', isLowStock: false },
        { name: 'Jasmine Rice', lastUpdated: '15-03-2024', totalAmount: '28/45', percentage: '62%', isLowStock: false },
        // Add more items as needed
    ];



    // const lowStockItems = useSelector(state => state)
    const allStockItems = useSelector(state => state.stocksReducer.stocks)
    const lowStockItems = useSelector(state => state.stocksReducer.lowStocks)
    console.log("allStockItems")
    console.log(allStockItems)
    console.log("lowStockItems")
    console.log(lowStockItems)


    useEffect(() => {
        dispatch(getAllStocksAction())
        dispatch(getLowStocksAction())
    }, [])



    return (

        <>
            <div style={{ marginTop: '5vw' }}>
                {/* <Container maxW={'300px'} bg={''} padding={'20px'}> */}
                <h3
                    style={{ marginLeft: '10px', fontWeight: '900' }}
                > Low Stocks Alert  </h3>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        padding: '10px',
                        marginLeft: '10px',
                    }}
                >

                    {lowStockItems.map((item, index) => (
                        <Box
                            key={index}
                            minWidth={'300px'}
                            marginLeft={'25px'}
                            marginTop={'25px'}
                            maxW={'300px'}
                            bg={'pink.100'}
                            borderRadius={'3xl'}
                            padding={'20px'}
                        >
                            <>
                                <Flex justifyContent="space-between">
                                    <Box>
                                        <h4 style={{ fontWeight: '600' }}>{item.item_name}</h4>
                                        <Text color='gray.500'>Last Updated {item.Last_Replenished.split('T')[0]} </Text>
                                    </Box>
                                    <Box justifyContent={'end'}>
                                        <LuSoup
                                            size={'30'}
                                        />
                                    </Box>
                                </Flex>
                                <Flex justifyContent={'end'} marginTop={'15px'} marginBottom={'20px'}>
                                    <Flex>
                                        <Circle
                                            size="10px"
                                            marginTop={'8px'}
                                            marginRight={'5px'}
                                            bg='red'
                                        />
                                        <h6>Low Stock</h6>
                                    </Flex>
                                </Flex>
                                <Box marginTop={'10px'}>
                                    <div
                                        style={{
                                            background: 'white',
                                            height: '6px',
                                            borderRadius: '50px',
                                            width: '100%',
                                            display: 'flex',
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: 'red',
                                                height: '6px',
                                                borderRadius: '50px',
                                                width: `${parseInt((item.usage_rate_value / item.available_quantity) * 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                </Box>
                                <Flex justifyContent={'space-between'} marginTop={'4'}>
                                    <Stack direction={'row'}>
                                        <Text>{`${item.usage_rate_value} / ${item.available_quantity}`}</Text>
                                        <Text color='gray.500'>Total Amount</Text>
                                    </Stack>
                                    <span>{(item.usage_rate_value / item.available_quantity).toFixed(1) * 100}%</span>
                                </Flex>
                            </>
                        </Box>
                    ))}


                </div>







            </div >

            <div style={{ marginTop: '5vw' }}>
                {/* <Container maxW={'300px'} bg={''} padding={'20px'}> */}
                <h3
                    style={{ marginLeft: '10px', fontWeight: '900' }}
                >  Overall Stocks  </h3>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        padding: '10px',
                        marginLeft: '10px',
                    }}
                >

                    {allStockItems.map((item, index) => (
                        <Box
                            key={index}
                            minWidth={'300px'}
                            marginLeft={'25px'}
                            marginTop={'25px'}
                            maxW={'300px'}
                            bg={'pink.100'}
                            borderRadius={'3xl'}
                            padding={'20px'}
                        >
                            <>
                                <Flex justifyContent="space-between">
                                    <Box>
                                        <h4 style={{ fontWeight: '600' }}>{item.item_name}</h4>
                                        <Text color='gray.500'>Last Updated {item.Last_Replenished.split('T')[0]} </Text>
                                    </Box>
                                    <Box justifyContent={'end'}>
                                        <LuSoup
                                            size={'30'}
                                        />
                                    </Box>
                                </Flex>
                                <Flex justifyContent={'end'} marginTop={'15px'} marginBottom={'20px'}>
                                    <Flex>
                                        <Circle
                                            size="10px"
                                            marginTop={'8px'}
                                            marginRight={'5px'}
                                            bg={parseInt((item.usage_rate_value / item.available_quantity) * 100) >= 70 ? 'red' : 'green'} // Change color based on percentage (70% threshold)
                                        />

                                        {parseInt((item.usage_rate_value / item.available_quantity) * 100) >= 70 ?
                                            <>
                                                <h6> Low Stock</h6>
                                            </>
                                            :
                                            <>
                                                <h6> In Stock</h6>
                                            </>
                                        }
                                    </Flex>
                                </Flex>
                                <Box marginTop={'10px'}>
                                    <div
                                        style={{
                                            background: 'white',
                                            height: '6px',
                                            borderRadius: '50px',
                                            width: '100%',
                                            display: 'flex',
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: parseInt((item.usage_rate_value / item.available_quantity) * 100) >= 70 ? 'red' : 'green', // Change color based on percentage (70% threshold)
                                                height: '6px',
                                                borderRadius: '50px',
                                                width: `${parseInt((item.usage_rate_value / item.available_quantity) * 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                </Box>
                                <Flex justifyContent={'space-between'} marginTop={'4'}>
                                    <Stack direction={'row'}>
                                        <Text>{`${item.usage_rate_value} / ${item.available_quantity}`}</Text>
                                        <Text color='gray.500'>Total Amount</Text>
                                    </Stack>
                                    <span>{parseFloat(((item.usage_rate_value / item.available_quantity) * 100).toFixed(1))}%</span>
                                </Flex>
                            </>
                        </Box>
                    ))}


                </div>


            </div >


        </>
    )
}

export default LowStockCard
