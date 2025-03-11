import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  Heading,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { postDineInOrderAction } from "../../../../../redux/action/dineInOrder";
import { ResetOrderItemAction } from "../../../../../redux/action/OrderItems";
import { resetFormDataAction } from "../../../../../redux/action/dineInStepperForm";
import PropTypes from "prop-types";
import { useToast } from "../../../../../contexts/useToast";

// DineInOrderSummary component definition
const DineInOrderSummary = ({ goToPreviousStep }) => {
  // Chakra UI color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();
  const dineInData = useSelector((state) => state.dineInForm);
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const userId = localData?.result?._id;
  const role = localData?.result?.role;

  const allOrderItems = useSelector((state) => state?.OrderItemReducer);
  const cartItems = allOrderItems?.items;
  const totalAmount = allOrderItems?.total;

  // Handle dine-in order completion
  const handleCompleteOrder = (e) => {
    e.preventDefault();

    const dineInOrderData = {
      ...dineInData,
      orderItems: cartItems,
      totalPrice: totalAmount,
      created_by: userId,
    };

    dispatch(postDineInOrderAction(dineInOrderData)).then((res) => {
      if (res.success) {
        dispatch(resetFormDataAction());
        dispatch(ResetOrderItemAction());
        navigate(
          role === "admin" ? "/admin/order-history" : "/employee/order-history"
        );
        showToast(res.message, "success");
      } else showToast(res.message, "error");
    });
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Dine-In Summary</Heading>

      {/* Dine-In Information Section */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          Dine-In Information
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
            <strong>Table Number:</strong> {dineInData.tableNumber}
          </Text>
          <Text mb={2}>
            <strong>Number of Guests:</strong> {dineInData.numberOfGuests}
          </Text>
          {dineInData.customerName && (
            <Text mb={2}>
              <strong>Customer Name:</strong> {dineInData.customerName}
            </Text>
          )}
          {dineInData.phoneNumber && (
            <Text mb={2}>
              <strong>Phone Number:</strong> {dineInData.phoneNumber}
            </Text>
          )}
          {dineInData.emailAddress && (
            <Text mb={2}>
              <strong>Email Address:</strong> {dineInData.emailAddress}
            </Text>
          )}
          {dineInData.specialRequests && (
            <Text mb={2}>
              <strong>Special Requests:</strong> {dineInData.specialRequests}
            </Text>
          )}
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
          Previous
        </Button>
        <Button onClick={handleCompleteOrder} colorScheme="blue">
          Confirm Dine-In Order
        </Button>
      </Stack>
    </Box>
  );
};

DineInOrderSummary.propTypes = {
  goToPreviousStep: PropTypes.func.isRequired,
};

export default DineInOrderSummary;
