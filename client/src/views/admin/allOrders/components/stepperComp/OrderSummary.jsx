import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Flex,
    Text,
    Image,
    Heading,
    useColorModeValue,
    Stack,
} from '@chakra-ui/react';
import { postCompleteOrderAction } from '../../../../../redux/action/completeOrder';
import { toast } from 'react-toastify';

const OrderSummary = ({ goToNextStep, goToPreviousStep }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    const dispatch = useDispatch();
    const addressData = useSelector((state) => state.form)
    console.log("addressData :", addressData)

    const localData = JSON.parse(localStorage.getItem('ProfileData'));
    const userId = localData?.result?._id;

    const allOrderItems = useSelector(state => state?.OrderItemReducer)
    const cartItems = allOrderItems?.items;
    const totalAmount = allOrderItems?.total;

    const handleCompleteOrder = (e) => {
        e.preventDefault();
        // const {
        //     name,
        //     phoneNumber,
        //     paymentMethod,
        //     deliveryMethod,
        //     address,
        //     address2,
        //     city,
        //     state,
        //     zip,
        //     noteFromCustomer,
        // } = addressData

        const completeOrderData = {
            ...addressData,
            orderItems: cartItems,
            TotalPrice: totalAmount,
            created_by: userId
        }

        console.log("addressData", addressData)
        console.log("cartItems", cartItems)
        console.log("totalAmount", totalAmount)
        // console.log("Order Completed");
        dispatch(postCompleteOrderAction(completeOrderData)).then((res) => {
            if(res.success){
                toast.success(res.message)
            }else{
                toast.error(res.message)
            }
        })

    }


    // Static address data
    //   const addressData = {
    //     name: 'John Doe',
    //     phoneNumber: '1234567890',
    //     paymentMethod: 'Online',
    //     deliveryMethod: 'Delivery',
    //     address: '1234 Main St',
    //     address2: 'Apartment, studio, or floor',
    //     city: 'City',
    //     state: 'State',
    //     zip: '12345',
    //     noteFromCustomer: 'Any special instructions?',
    //   };

    // Static cart items data
    // const cartItems = [
    //     {
    //         orderName: 'Product A',
    //         quantity: 2,
    //         priceVal: 10,
    //         priceUnit: 'Euro',
    //         pic: 'https://via.placeholder.com/50', // Replace with actual image URL
    //     },
    //     {
    //         orderName: 'Product B',
    //         quantity: 1,
    //         priceVal: 15,
    //         priceUnit: 'Euro',
    //         pic: 'https://via.placeholder.com/50', // Replace with actual image URL
    //     },
    // ];

    // Calculate total
    // const totalAmount = cartItems.reduce((total, item) => {
    //     return total + item.quantity * item.priceVal;
    // }, 0);

    return (
        <Box p={4}>
            <Heading mb={4}>Summary Page</Heading>

            {/* Address Section */}
            <Box mb={8}>
                <Heading size="md" mb={4}>
                    Address Information
                </Heading>
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    bg={bgColor}
                    borderColor={borderColor}
                    p={4}
                >
                    <Text mb={2}>
                        <strong>Name:</strong> {addressData.name}
                    </Text>
                    <Text mb={2}>
                        <strong>Phone Number:</strong> {addressData.phoneNumber}
                    </Text>
                    <Text mb={2}>
                        <strong>Payment Method:</strong> {addressData.paymentMethod}
                    </Text>
                    <Text mb={2}>
                        <strong>Delivery Method:</strong> {addressData.deliveryMethod}
                    </Text>
                    <Text mb={2}>
                        <strong>Address:</strong> {addressData.address}
                    </Text>
                    <Text mb={2}>
                        <strong>Address 2:</strong> {addressData.address2}
                    </Text>
                    <Text mb={2}>
                        <strong>City:</strong> {addressData.city}
                    </Text>
                    <Text mb={2}>
                        <strong>State:</strong> {addressData.state}
                    </Text>
                    <Text mb={2}>
                        <strong>Zip:</strong> {addressData.zip}
                    </Text>
                    <Text mb={2}>
                        <strong>Note from Customer:</strong> {addressData.noteFromCustomer}
                    </Text>
                </Box>
            </Box>

            {/* Cart Items Section */}
            <Box mb={8}>
                <Heading size="md" mb={4}>
                    Your Cart Items
                </Heading>
                {cartItems.map((item, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        mb={4}
                        boxShadow="md"
                        bg={bgColor}
                        borderColor={borderColor}
                        p={4}
                    >
                        <Flex justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center">
                                <Image
                                    borderRadius="md"
                                    boxSize="50px"
                                    src={item.pic}
                                    alt="Food Image"
                                    mr={4}
                                />
                                <Box>
                                    <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        as="h4"
                                        lineHeight="tight"
                                        color={textColor}
                                        isTruncated
                                    >
                                        {item.orderName}
                                    </Text>
                                    <Text
                                        fontSize="md"
                                        fontWeight="medium"
                                        as="h5"
                                        lineHeight="tight"
                                        color={textColor}
                                        isTruncated
                                    >
                                        {item.quantity} X {item.priceVal} {item.priceUnit}
                                    </Text>
                                </Box>
                            </Box>
                            <Text fontWeight="medium" color={textColor}>
                                {item.quantity * item.priceVal} {item.priceUnit}
                            </Text>
                        </Flex>
                    </Box>
                ))}
            </Box>

            {/* Total Amount */}
            <Box>
                <Heading size="md" mb={4}>
                    Order Summary
                </Heading>
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    bg={bgColor}
                    borderColor={borderColor}
                    p={4}
                >
                    <Flex justifyContent="space-between" alignItems="center" mb={2}>
                        <Text color={textColor}>Total Amount:</Text>
                        <Text fontWeight="bold" color={textColor}>
                            {totalAmount} Euro
                        </Text>
                    </Flex>
                </Box>
            </Box>

            {/* Buttons for navigation */}
            <Stack direction="row" spacing={4} mt={8}>
                <Button onClick={goToPreviousStep} colorScheme="gray">
                    Back to Address
                </Button>
                <Button onClick={handleCompleteOrder} colorScheme="blue">
                    Confirm Order
                </Button>
            </Stack>
        </Box>
    );
};

export default OrderSummary;
