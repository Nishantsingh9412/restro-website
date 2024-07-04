import React, { useEffect, useState } from 'react'
import { MdLocalShipping } from 'react-icons/md';
import {
    Box,
    Heading,
    Text,
    UnorderedList,
    ListItem,
    Stack,
    SimpleGrid
} from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getCompleteOrderAction } from '../../../redux/action/completeOrder.js';

const OrderHistory = () => {

    const dispatch = useDispatch();

    const compOrderData = useSelector((state) => state?.compOrder?.data)
    console.log("compOrderData :", compOrderData)

    const localUserData = JSON.parse(localStorage.getItem('ProfileData'));
    const localUserId = localUserData?.result?._id

    useEffect(() => {
        dispatch(getCompleteOrderAction(localUserId))
    }, [])

    const handleAllotDeliveryBoy = () => {
       console.log('Allot Delivery Boy Pending .........')
    }

    return (
        <div style={{ marginTop: '5vw', marginLeft: '4vw' }}>
            <Box maxW="1200px" mx="auto" p="4">
                <Heading as="h1" size="xl" mb="4">Recent Orders</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {compOrderData?.map(order => (
                        <Box key={order._id.$oid} border="1px" borderColor="gray.200" borderRadius="md" p="4" shadow="md">
                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <Heading as="h2" size="md" mb="2">Order # {order.orderId} </Heading>
                                <IconButton
                                    onClick={handleAllotDeliveryBoy}
                                    aria-label='Allot Delivery Boy'
                                    title='Allot Delivery Boy'
                                    icon={<MdLocalShipping />}
                                />
                            </Box>
                            <Text mb="2"><strong>Customer:</strong> {order.name}</Text>
                            <Text mb="2"><strong>Phone:</strong> {order.phoneNumber}</Text>
                            <Text mb="2"><strong>Payment Method:</strong> {order.paymentMethod}</Text>
                            <Text mb="2"><strong>Delivery Method:</strong> {order.deliveryMethod}</Text>
                            <Text mb="2"><strong>Address:</strong> {order.address}, {order.city}, {order.state}, {order.zip}</Text>
                            <Text mb="2"><strong>Note from Customer:</strong> {order.noteFromCustomer}</Text>
                            <Text mb="2"><strong>Total Price:</strong> ${order.TotalPrice}</Text>
                            <Heading as="h3" size="sm" mt="4" mb="2">Order Items:</Heading>
                            <UnorderedList>
                                {order.orderItems.map(item => (
                                    <ListItem key={item._id}>
                                        {/* Item ID: {item.item.$oid} -  */}
                                        Quantity: {item.quantity} - Total: ${item.total}
                                    </ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>
        </div>
    )
}

export default OrderHistory
