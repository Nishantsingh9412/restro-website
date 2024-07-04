import { Box, Circle, Container, Flex, Stack, Text } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import React, { useEffect } from 'react'
import { LuSoup } from 'react-icons/lu'
import { useSelector } from 'react-redux'

import { getLowStocksAction, getAllStocksAction } from '../../../../redux/action/stocks'


const LowStockCard = () => {

    const dispatch = useDispatch();
    
    const localData = JSON.parse(localStorage.getItem('ProfileData'));
    const userId = localData?.result?._id;


    // const lowStockItems = useSelector(state => state)
    const allStockItems = useSelector(state => state.stocksReducer.stocks)
    const lowStockItems = useSelector(state => state.stocksReducer.lowStocks)
    console.log("allStockItems")
    console.log(allStockItems)
    console.log("lowStockItems")
    console.log(lowStockItems)


    useEffect(() => {
        dispatch(getAllStocksAction(userId))
        dispatch(getLowStocksAction(userId))
    }, [])



    return (

        <>
            <div style={{ marginTop: '5vw', fontWeight: 'bold' }}>
                <h3
                    style={{ marginLeft: '10px', fontWeight: '900', color: '#3e97cd' }}
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
                            minWidth={'340px'}
                            marginLeft={'25px'}
                            marginTop={'25px'}
                            maxW={'300px'}
                            bg={'#f3f2ee'}
                            boxShadow={'2px 2px 2px #b39b9b'}
                            border={'5px solid #fff'}
                            borderRadius={'3xl'}
                            padding={'20px'}
                            color={index & 1 ? '#ee2d4f' : '#ee7213'}
                        >
                            <>
                                <Flex justifyContent="space-between">
                                    <Box>
                                        <h4 style={{ fontWeight: '600', }}>{item.item_name}</h4>
                                        <Text >Last Updated {item.updatedAt.split('T')[0]} </Text>
                                    </Box>
                                    <Box justifyContent={'end'}>
                                        <Box
                                            color={'saddlebrown'}
                                            backgroundColor={'white'}
                                            borderRadius={'3xl'}
                                            padding={'10px'}
                                        >
                                            <LuSoup size={'30'} />
                                        </Box>
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
                                        <h6
                                            style={{ color: 'red' }}
                                        >Low Stock</h6>
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
                                                width: `${parseInt((item.minimum_quantity / item.available_quantity) * 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                </Box>
                                <Flex justifyContent={'space-between'} marginTop={'4'}>
                                    <Stack direction={'row'}>
                                        <Text
                                        > {`${item.minimum_quantity} / ${item.available_quantity}`} </Text>
                                        <Text >Total Amount</Text>
                                    </Stack>
                                    <span
                                        style={{
                                            border: index & 1 ? '2px solid #ee2d4f' : '2px solid #ee7213',
                                            padding: '3px',
                                            borderRadius: '10%',
                                            fontSize: 'smaller'
                                        }}
                                    > {(item.minimum_quantity / item.available_quantity).toFixed(1) * 100}%</span>
                                </Flex>
                            </>
                        </Box>
                    ))}
                </div>
            </div >

            <div style={{ marginTop: '5vw' }}>
                <h3
                    style={{ marginLeft: '10px', fontWeight: '900', color: '#3e97cd' }}
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
                            minWidth={'340px'}
                            marginLeft={'25px'}
                            marginTop={'25px'}
                            boxShadow={'2px 2px 2px #b39b9b'}
                            maxW={'300px'}
                            bg={'#F3F2EE'}
                            color={index & 1 ? '#ee7213' : '#ee2d4f'}
                            fontWeight={'bold'}
                            borderRadius={'3xl'}
                            padding={'20px'}
                            border={'5px solid #fff'}
                        >
                            <>
                                <Flex justifyContent="space-between">
                                    <Box>
                                        <h4 style={{ fontWeight: '600' }}>{item.item_name}</h4>
                                        <Text >Last Updated {item.updatedAt.split('T')[0]} </Text>
                                    </Box>
                                    <Box justifyContent={'end'}>
                                        <Box
                                            color={'saddlebrown'}
                                            backgroundColor={'white'}
                                            borderRadius={'3xl'}
                                            padding={'10px'}
                                        >
                                            <LuSoup size={'30'} />
                                        </Box>
                                    </Box>
                                </Flex>
                                <Flex justifyContent={'end'} marginTop={'15px'} marginBottom={'20px'}>
                                    <Flex>
                                        <Circle
                                            size="10px"
                                            marginTop={'8px'}
                                            marginRight={'5px'}
                                            bg={parseInt((item.minimum_quantity / item.available_quantity) * 100) >= 70 ? 'red' : 'green'} // Change color based on percentage (70% threshold)
                                        />

                                        {parseInt((item.minimum_quantity / item.available_quantity) * 100) >= 70 ?
                                            <>
                                                <h6
                                                    style={{ color: 'red' }}
                                                > Low Stock</h6>
                                            </>
                                            :
                                            <>
                                                <h6
                                                    style={{ color: 'green' }}
                                                > In Stock</h6>
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
                                                background: parseInt((item.minimum_quantity / item.available_quantity) * 100) >= 70 ? 'red' : 'green', // Change color based on percentage (70% threshold)
                                                height: '6px',
                                                borderRadius: '50px',
                                                width: `${parseInt((item.minimum_quantity / item.available_quantity) * 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                </Box>
                                <Flex justifyContent={'space-between'} marginTop={'4'}>
                                    <Stack direction={'row'}>
                                        <Text>{`${item.minimum_quantity} / ${item.available_quantity}`}</Text>
                                        <Text >Total Amount</Text>
                                    </Stack>
                                    <span
                                        style={{
                                            border: index & 1 ? '2px solid #ee7213' : '2px solid #ee2d4f',
                                            padding: '3px',
                                            borderRadius: '10%',
                                            fontSize: 'smaller'
                                        }}

                                    >{parseFloat(((item.minimum_quantity / item.available_quantity) * 100).toFixed(1))}%</span>
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
