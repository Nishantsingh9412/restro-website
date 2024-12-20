import {
    Button,
    Box,
    Flex,
    Text,
    Image,
    Heading,
    useColorModeValue,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useMemo } from "react";

const AllOrdersData = ({ goToNextStep, goToPreviousStep }) => {
    // Define color mode values for background, border, and text
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");

    // Get all order items from the Redux store
    const allOrderItems = useSelector((state) => state?.OrderItemReducer);
    // Memoize the cart items to avoid unnecessary re-renders
    const allCartItems = useMemo(() => allOrderItems?.items, [allOrderItems]);
    // Memoize the total order items (commented out)
    // const AllOrderItemsTotal = useMemo(() => allOrderItems?.total, [allOrderItems]);

    return (
        <div>
            <Heading>Your Cart Items</Heading>
            <Box>
                {allCartItems?.map((item, index) => {
                    const { pic, orderName, quantity, priceVal, priceUnit } = item;
                    const totalPrice = quantity * priceVal;
                    const displayPriceUnit = priceUnit === "Euro" ? " €" : priceUnit;

                    return (
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
                                            borderRadius="md"
                                            boxSize="50px"
                                            src={pic}
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
                                                {orderName}
                                            </Text>
                                            <Text
                                                fontSize="md"
                                                fontWeight="medium"
                                                as="h5"
                                                lineHeight="tight"
                                                color={textColor}
                                                isTruncated
                                            >
                                                {quantity} X {priceVal}
                                                {displayPriceUnit}
                                            </Text>
                                        </Box>
                                    </Box>
                                </Flex>
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Text fontWeight="medium" color={textColor}>
                                        {totalPrice} {displayPriceUnit}
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
            <Button onClick={goToPreviousStep}>Back to Address</Button>
            <Button onClick={goToNextStep}>Forward to Summary</Button>
        </div>
    );
};

// Define prop types for the component
AllOrdersData.propTypes = {
    goToNextStep: PropTypes.func.isRequired,
    goToPreviousStep: PropTypes.func.isRequired,
};

export default AllOrdersData;
