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
import { postDeliveryOrderAction } from "../../../../../redux/action/deliveryOrder";
import { resetFormDataAction } from "../../../../../redux/action/stepperFormAction";
import { ResetOrderItemAction } from "../../../../../redux/action/OrderItems";
import PropTypes from "prop-types";
import { useToast } from "../../../../../contexts/useToast";
import CartSummary from "../CartSummary";

// OrderSummary component definition
const OrderSummary = ({ goToPreviousStep }) => {
  const toast = useToast();
  // Chakra UI color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addressData = useSelector((state) => state.form);
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const userId = localData?.result?._id;
  const role = localData?.result?.role;

  const allOrderItems = useSelector((state) => state?.OrderItemReducer);
  const cartItems = allOrderItems?.items;
  const totalAmount = allOrderItems?.total;

  // Handle order completion
  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const deliveryOrderData = {
      ...addressData,
      orderItems: cartItems,
      totalPrice: totalAmount,
      created_by: userId,
    };
    dispatch(postDeliveryOrderAction(deliveryOrderData)).then((res) => {
      if (res.success) {
        dispatch(resetFormDataAction());
        dispatch(ResetOrderItemAction());
        navigate(
          role === "admin" ? "/admin/order-history" : "/employee/order-history"
        );
        toast(res.message, "success");
      } else {
        toast(res.message, "error");
      }
    });
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Summary Page</Heading>
      {/* /* Address Section */}
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
          {Object.entries(addressData)
            .filter(
              ([key]) =>
                !["dropLocation", "created_by", "lat", "lng"].includes(key)
            )
            .map(([key, value]) => (
              <Text mb={2} key={key}>
                <strong>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  :
                </strong>{" "}
                {value
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </Text>
            ))}
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
          Confirm Delivery Order
        </Button>
      </Stack>
    </Box>
  );
};

OrderSummary.propTypes = {
  goToPreviousStep: PropTypes.func.isRequired,
};

export default OrderSummary;
