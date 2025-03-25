import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Text,
  Heading,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { postDineInOrderAction } from "../../../../../redux/action/dineInOrder";
import { ResetOrderItemAction } from "../../../../../redux/action/OrderItems";
import { resetFormDataAction } from "../../../../../redux/action/dineInStepperForm";
import PropTypes from "prop-types";
import { useToast } from "../../../../../contexts/useToast";
import CartSummary from "../CartSummary";

// DineInOrderSummary component definition
// eslint-disable-next-line no-unused-vars
const DineInOrderSummary = ({ goToPreviousStep, cancelOrder }) => {
  // Chakra UI color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
          {dineInData.paymentMethod && (
            <Text mb={2}>
              <strong>Payment Method:</strong>{" "}
              {dineInData.paymentMethod?.[0].toUpperCase() +
                dineInData.paymentMethod?.slice(1)}
            </Text>
          )}

          {dineInData.specialRequests && (
            <Text mb={2}>
              <strong>Special Requests:</strong> {dineInData.specialRequests}
            </Text>
          )}
        </Box>
      </Box>
      {/* Cart Items Section  */}
      <CartSummary cartItems={cartItems} totalAmount={totalAmount} />
      {/* Buttons for navigation */}
      <Stack direction="row" spacing={4} mt={8}>
        <Button onClick={cancelOrder} colorScheme="gray">
          Cancel
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
  cancelOrder: PropTypes.func.isRequired,
};

export default DineInOrderSummary;
