import React, { useState } from 'react';
import {
    Box,
    Image,
    Text,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Button,
    Flex,
    IconButton
} from '@chakra-ui/react';
import { FaCartShopping } from 'react-icons/fa6';
import { BiSolidTrash } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';


const CartDrawer = (props) => {

    const isOpen = props.isOpen
    const onOpen = props.onOpen
    const onClose = props.onClose
    const [placement, setPlacement] = useState('right')
    const dispatch = useDispatch();

    const allOrderItems = useSelector(state => state?.OrderItemReducer)
    const allCartItems = allOrderItems?.items;
    console.log("allCartItems :", allCartItems)

    const AllOrderItemsTotal = allOrderItems?.total;
    console.log("AllOrderItemsTotal :", AllOrderItemsTotal)


    const handleRemoveItemOrderCompletely = (id) => {
        // console.log("Remove Item Completely Clicked", id);
        if (id !== undefined) {
            dispatch({ type: 'REMOVE_ORDER_ITEM_TEMP_COMPLETELY', data: id })
        }
    }

    const handleRemoveItemOrder = (id) => {
        console.log("Remove Item Clicked", id);
        if (id !== undefined) {
            // setAllOrderTotal(allOrderTotal - selectedItemTemp.find(item => item._id === id).priceVal);
            dispatch({ type: 'REMOVE_ORDER_ITEM_TEMP', data: id })
        }
    }

    const handleAddItemOrder = (product) => {
        console.log("Add Item Clicked", product)
        if (product !== undefined) {
            // setAllOrderTotal(allOrderTotal + product.priceVal);
            dispatch({ type: 'ADD_ORDER_ITEM_TEMP', data: product })
        }
    }


    return (
        <div>
            <>
                {
                    /* <Button colorScheme='blue' onClick={onOpen}>
                        Open
                    </Button> */
                }
                <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size='md' >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader borderBottomWidth='1px'>
                            <Flex justifyContent="space-between" alignItems="center">
                                <Flex alignItems="center">
                                    <FaCartShopping />
                                    <Text marginLeft="2">Your Cart</Text>
                                </Flex>
                                <IconButton
                                    icon={<FaTimes />}
                                    onClick={onClose}
                                    variant="ghost"
                                />
                            </Flex>
                        </DrawerHeader>
                        <DrawerBody>
                            {allCartItems?.map((item, index) => (
                                <Box key={index}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    mb={3}
                                >
                                    {/* <Box p="6">
                                            <Box>
                                            <Box display="flex" alignItems="center">
                                                <Box>
                                                    <Image
                                                        borderRadius='full'
                                                        boxSize='50px'
                                                        src={item?.pic}
                                                        alt='Food-Image'
                                                    />
                                                </Box>
                                                <Box marginLeft={'1rem'}>
                                                    <Box>
                                                        <Text mt="1" display={'flex'} alignItems={'center'} fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                                            {item?.orderName}
                                                            <BiSolidTrash
                                                                size={'20'}
                                                                style={{ marginLeft: '8px', marginTop: '2px', cursor: 'pointer', color: 'red' }}
                                                                // onClick={handleRemoveItemOrder.bind(this, item._id}}
                                                                onClick={() => handleRemoveItemOrderCompletely(item._id)}
                                                            />
                                                        </Text>

                                                        <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                                            {item?.quantity} X  {item?.priceVal}
                                                            {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                                        </Text>
                                                    </Box>

                                                </Box>
                                                <Box>
                                                    <Box display={'flex'} justifyContent={'end'}>
                                                        <Box
                                                            display={'flex'}
                                                            background={'#fa4a0c'}
                                                            color={'white'}
                                                            gap={'1rem'}
                                                            borderRadius={'50px'}
                                                            paddingRight={'10px'}
                                                            paddingLeft={'10px'}
                                                        >
                                                            <Text
                                                                style={{ cursor: 'pointer', userSelect: 'none', fontSize: '20px' }}
                                                                onClick={() => {
                                                                    handleAddItemOrder(item);
                                                                }}
                                                            >+</Text>
                                                            <Text
                                                                style={{ cursor: 'pointer', userSelect: 'none', fontSize: '20px' }}
                                                                onClick={() => {
                                                                    handleRemoveItemOrder(item._id);
                                                                }}
                                                            >-</Text>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>

                                        </Box>

                                        <Box display={'flex'} justifyContent={'end'}>
                                            {item?.quantity * item?.priceVal} {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                        </Box>
                                    </Box> */}
                                    <Box p="6">
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <Box display="flex" alignItems="center">
                                                <Image
                                                    borderRadius='full'
                                                    boxSize='50px'
                                                    src={item?.pic}
                                                    alt='Food-Image'
                                                />
                                                <Box marginLeft={'1rem'}>
                                                    <Text mt="1" display={'flex'} alignItems={'center'} fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                                        {item?.orderName}
                                                    </Text>
                                                    <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                                        {item?.quantity} X {item?.priceVal}
                                                        {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                                    </Text>
                                                </Box>
                                            </Box>
                                            <Flex
                                                background={'#fa4a0c'}
                                                color={'white'}
                                                gap={'1rem'}
                                                borderRadius={'50px'}
                                                paddingRight={'10px'}
                                                paddingLeft={'10px'}
                                                alignItems="center"
                                            >
                                                <Text
                                                    style={{ cursor: 'pointer', userSelect: 'none', fontSize: '20px' }}
                                                    onClick={() => handleAddItemOrder(item)}
                                                >+</Text>
                                                <Text
                                                    style={{ cursor: 'pointer', userSelect: 'none', fontSize: '20px' }}
                                                    onClick={() => handleRemoveItemOrder(item._id)}
                                                >-</Text>
                                            </Flex>
                                        </Flex>
                                        <Box display={'flex'} justifyContent={'end'} marginTop={'0.5rem'}>
                                            {item?.quantity * item?.priceVal} {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                            {/* {AllOrderItemsTotal > 0 && (
                                <Text
                                    marginTop={'5px'}
                                    display={'flex'}
                                    justifyContent={'end'}
                                    marginRight={'1rem'}
                                >
                                    Total : {parseFloat(AllOrderItemsTotal).toFixed(2)} €

                                </Text>
                            )} */}
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                position={'absolute'}
                                bottom={'0'}
                                padding={'1rem'}
                                width={'90%'}

                            >
                                <Box
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    padding={'1rem'}
                                    borderTopWidth={'1px'}
                                >

                                    <Text
                                        fontWeight={'bold'}
                                        fontSize={'2xl'}
                                    >
                                        Subtotal :
                                    </Text>

                                    <Text
                                        fontWeight={'bold'}
                                        fontSize={'2xl'}
                                        color={'#029CFF'}
                                    >
                                        {parseFloat(AllOrderItemsTotal).toFixed(2)} €
                                    </Text>
                                </Box>

                                <Button
                                    background={'#029CFF'}
                                    color={'white'}
                                    _hover={{ color: '#029CFF', bg: 'whitesmoke' }}
                                // colorScheme='blue'
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </>
        </div>
    )
}

export default CartDrawer
