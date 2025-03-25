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
import { postTakeAwayOrderAction } from "../../../../../redux/action/takeAwayOrder";
import { ResetOrderItemAction } from "../../../../../redux/action/OrderItems";
import { resetFormDataAction } from "../../../../../redux/action/takeAwayStepperForm";
import PropTypes from "prop-types";
import { useToast } from "../../../../../contexts/useToast";
import CartSummary from "../CartSummary";

// TakeAwaySummary component definition
const TakeAwaySummary = ({ goToPreviousStep }) => {
  // Chakra UI color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();
  const takeAwayData = useSelector((state) => state.takeAwayForm);
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const userId = localData?.result?._id;
  const role = localData?.result?.role;

  const allOrderItems = useSelector((state) => state?.OrderItemReducer);
  const cartItems = allOrderItems?.items;
  const totalAmount = allOrderItems?.total;

  // Handle TakeAway order completion
  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const takeAwayOrderData = {
      ...takeAwayData,
      orderItems: cartItems,
      totalPrice: totalAmount,
      created_by: userId,
    };
    dispatch(postTakeAwayOrderAction(takeAwayOrderData)).then((res) => {
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
      <Heading mb={4}>Take-Away Summary</Heading>

      {/* TakeAway Information Section */}
      <Box mb={8}>
        <Heading size="md" mb={4}>
          TakeAway Information
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
          {takeAwayData.customerName && (
            <Text mb={2}>
              <strong>Customer Name:</strong> {takeAwayData.customerName}
            </Text>
          )}
        </Box>
      </Box>

      {/* Cart Items Section */}
      <CartSummary cartItems={cartItems} totalAmount={totalAmount} />
      {/* Buttons for navigation */}
      <Stack direction="row" spacing={4} mt={8}>
        <Button onClick={goToPreviousStep} colorScheme="gray">
          Previous
        </Button>
        <Button onClick={handleCompleteOrder} colorScheme="blue">
          Confirm Take-Away Order
        </Button>
      </Stack>
    </Box>
  );
};

TakeAwaySummary.propTypes = {
  goToPreviousStep: PropTypes.func.isRequired,
};

export default TakeAwaySummary;
