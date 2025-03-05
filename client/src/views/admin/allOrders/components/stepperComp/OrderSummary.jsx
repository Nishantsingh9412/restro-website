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
import { postDeliveryOrderAction } from "../../../../../redux/action/deliveryOrder";
import { resetFormDataAction } from "../../../../../redux/action/stepperFormAction";
import { ResetOrderItemAction } from "../../../../../redux/action/OrderItems";
import PropTypes from "prop-types";
import { useToast } from "../../../../../contexts/useToast";

// OrderSummary component definition
const OrderSummary = ({ goToPreviousStep }) => {
  const toast = useToast();
  // Chakra UI color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

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
          Confirm Order
        </Button>
      </Stack>
    </Box>
  );
};

OrderSummary.propTypes = {
  goToPreviousStep: PropTypes.func.isRequired,
};

export default OrderSummary;
