import React from 'react'
import {
    Button,
    Box,
    Flex,
    Text,
    Image,
    Heading,
    useColorModeValue
} from '@chakra-ui/react'

import { BiSolidTrash } from 'react-icons/bi'
import { useSelector } from 'react-redux'


const AllOrdersData = ({ goToNextStep, goToPreviousStep }) => {

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');


    const allOrderItems = useSelector(state => state?.OrderItemReducer)
    const allCartItems = allOrderItems?.items;
    console.log("allCartItems :", allCartItems)

    const AllOrderItemsTotal = allOrderItems?.total;
    console.log("AllOrderItemsTotal :", AllOrderItemsTotal)

    return (
        <div>
            <Heading> Your Cart Items </Heading>
            <Box>
                {allCartItems?.map((item, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        mb={4}
                        boxShadow="md"
                        bg={bgColor}
                        borderColor={borderColor}
                    >
                        <Box p="4">
                            <Flex justifyContent="space-between" alignItems="center">
                                <Box display="flex" alignItems="center">
                                    <Image
                                        borderRadius='md'
                                        boxSize='50px'
                                        src={item?.pic}
                                        alt='Food Image'
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
                                            {item?.orderName}
                                        </Text>
                                        <Text
                                            fontSize="md"
                                            fontWeight="medium"
                                            as="h5"
                                            lineHeight="tight"
                                            color={textColor}
                                            isTruncated
                                        >
                                            {item?.quantity} X {item?.priceVal}
                                            {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                        </Text>
                                    </Box>
                                </Box>
                            </Flex>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Text fontWeight="medium" color={textColor}>
                                    {item?.quantity * item?.priceVal} {item?.priceUnit === 'Euro' ? ' €' : item?.priceUnit}
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Button
                onClick={goToPreviousStep}
            >
                Back to Address
            </Button>

            <Button
                onClick={goToNextStep}
            >
                Forward to Summary
            </Button>
        </div>
    )
}

export default AllOrdersData
