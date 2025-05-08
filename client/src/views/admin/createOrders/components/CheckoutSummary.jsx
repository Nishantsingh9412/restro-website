import {
  Box,
  Button,
  VStack,
  Heading,
  HStack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Text,
  Divider,
  Flex,
  Icon,
  Image,
  Badge,
} from "@chakra-ui/react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import {
  formatPrice,
  guestTypes,
  orderTypes,
  userTypes,
} from "../../../../utils/constant";
import {
  addTakeAwayOrderAPI,
  addDineInOrderAPI,
  addDeliveryOrderAPI,
} from "../../../../api";
import { useToast } from "../../../../contexts/useToast";
import { useNavigate } from "react-router-dom";
import { localStorageData } from "../../../../utils/constant";

const CheckoutSummary = ({ isOpen, onClose }) => {
  const showToast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const orderDetails = useSelector((state) => state.customerInfo);
  const orderType = useSelector((state) => state.cart.orderType);
  const { guestsCart } = useSelector((state) => state?.cart);
  const role = useSelector((state) => state?.userReducer?.data?.role);

  // Memoized value for all cart items (either for all guests or a specific guest)
  const allCartItems = useMemo(() => {
    // Merge all guests' items into a single array
    return Object.keys(guestsCart).flatMap((guestName) =>
      (guestsCart[guestName].items || []).map((item) => ({
        ...item,
        guestName: guestName,
      }))
    );
  }, [guestsCart]);
  // Memoized value for the total price of all order items
  const allOrderItemsTotal = useMemo(() => {
    // Calculate the total for all guests
    return Object.values(guestsCart).reduce(
      (total, guestCart) => total + (guestCart.totalOrderPrice || 0),
      0
    );
  }, [guestsCart]);

  const userId = useMemo(
    () =>
      JSON.parse(localStorage.getItem(localStorageData.PROFILE_DATA))?.result
        ?._id,
    []
  );

  const formatKey = (key) =>
    key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) =>
          item?.name
            ? formatKey(item.name)
            : typeof item === "string"
            ? formatKey(item)
            : JSON.stringify(item)
        )
        .join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return Object.entries(value)
        .map(
          ([subKey, subValue]) =>
            `${formatKey(subKey)}: ${parseFloat(subValue || 0).toFixed(3)}`
        )
        .join(", ");
    }

    if (typeof value === "string") {
      return formatKey(value);
    }

    return String(value);
  };

  const getOrderAPICall = () => {
    switch (orderType) {
      case orderTypes.DELIVERY:
        return addDeliveryOrderAPI;
      case orderTypes.DINE_IN:
        return addDineInOrderAPI;
      case orderTypes.TAKE_AWAY:
        return addTakeAwayOrderAPI;
      default:
        return null;
    }
  };

  const handleCompleteOrder = () => {
    // Prepare the order data
    const orderData = {
      ...orderDetails[orderType],
      orderItems: allCartItems,
      totalPrice: allOrderItemsTotal,
      created_by: userId,
    };
    // You can dispatch an action or call an API to complete the order
    const apiCall = getOrderAPICall();
    if (!apiCall) {
      showToast("Invalid order type", "error");
      return;
    }
    setLoading(true);
    // Call the API to complete the order
    apiCall(orderData)
      .then((res) => {
        if (res.status === 201) {
          showToast("Order completed successfully", "success");
          navigate(
            role === userTypes.ADMIN
              ? "/admin/order-history"
              : "/employee/order-history"
          );
        }
      })
      .catch((error) => {
        showToast(
          error?.response?.data?.message || "Error completing order",
          "error"
        );
      });
    setLoading(false);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px" bg="blue.500" color="white">
          <Flex align="center">
            <Icon as={FaShoppingCart} mr={2} />
            Checkout Summary
          </Flex>
        </DrawerHeader>
        <DrawerBody bg="gray.50" p={6}>
          <HStack spacing={6} align="flex-start">
            {/* Left Side: User Details  */}
            <Box flex={1} bg="white" borderRadius="lg" boxShadow="md" p={6}>
              <Flex align="center" mb={4}>
                <Icon as={FaUser} mr={2} color="blue.500" />
                <Heading as="h2" size="md" color="gray.700">
                  User Details
                </Heading>
              </Flex>
              <Divider mb={4} />
              <VStack spacing={4} align="stretch">
                {orderDetails && (
                  <>
                    {Object.entries(orderDetails[orderType] || {}).map(
                      ([key, value]) => (
                        <Text key={key} fontSize="sm" color="gray.600">
                          <strong>{formatKey(key)}:</strong>{" "}
                          {formatValue(value)}
                        </Text>
                      )
                    )}
                  </>
                )}
              </VStack>
            </Box>
            {/* /* Right Side: Live Cart */}
            <Box flex={1} bg="white" borderRadius="lg" boxShadow="md" p={6}>
              <Flex align="center" mb={4}>
                <Icon as={FaShoppingCart} mr={2} color="blue.500" />
                <Heading as="h2" size="md" color="gray.700">
                  Live Cart
                </Heading>
              </Flex>
              <Divider mb={4} />
              <VStack spacing={2} align="stretch">
                {allCartItems.length > 0 ? (
                  Object.entries(guestsCart).map(([guestName, guestCart]) => (
                    <Box key={guestName}>
                      <Text fontWeight="bold" fontSize="md" color="gray.600">
                        {guestName !== guestTypes.GUEST
                          ? `${guestName}'s Orders:`
                          : ""}
                      </Text>
                      {guestCart.items.map((item) => (
                        <CartItem key={item.cartItemId} item={item} />
                      ))}
                      {guestName !== guestTypes.GUEST && (
                        <>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            mt={2}
                            textAlign="right"
                          >
                            Total:{" "}
                            {formatPrice(
                              guestCart.totalOrderPrice,
                              guestCart.items[0]?.priceUnit
                            )}
                          </Text>
                          <Divider my={2} />
                        </>
                      )}
                    </Box>
                  ))
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    Your cart is empty.
                  </Text>
                )}
              </VStack>
              {allCartItems.length > 0 && (
                <Box mt={4} display={"flex"} justifyContent="space-between">
                  <Text fontSize="md" fontWeight="bold" color="gray.700">
                    Subtotal:
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="blue.500">
                    {formatPrice(
                      allOrderItemsTotal,
                      allCartItems[0]?.priceUnit
                    )}
                  </Text>
                </Box>
              )}
              {allCartItems.length > 0 && (
                <Button
                  mt={6}
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  onClick={handleCompleteOrder}
                  isDisabled={allCartItems.length === 0}
                  _hover={{
                    bg: "blue.600",
                    color: "white",
                  }}
                  isLoading={loading}
                  loadingText="Processing..."
                >
                  Confirm {orderType[0]?.toUpperCase() + orderType?.slice(1)}{" "}
                  Order
                </Button>
              )}
            </Box>
          </HStack>
        </DrawerBody>
        <DrawerFooter bg="gray.100">
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

CheckoutSummary.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CheckoutSummary;

const CartItem = ({ item }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      mb={4}
      bg="white"
      boxShadow="sm"
    >
      <HStack spacing={4}>
        <Image
          boxSize="60px"
          objectFit="cover"
          src={item.pic || "https://via.placeholder.com/60"}
          alt={item.itemName}
          borderRadius="md"
        />
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="bold" fontSize="md" color="gray.700">
            {item.itemName}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Quantity: {item.totalQuantity}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Price: {formatPrice(item.price, item.priceUnit)}
          </Text>
        </VStack>
        <Badge colorScheme="blue" fontSize="sm">
          {formatPrice(
            item.totalQuantity * item.price.toFixed(2),
            item.priceUnit
          )}
        </Badge>
      </HStack>
    </Box>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    itemName: PropTypes.string.isRequired,
    totalQuantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    priceUnit: PropTypes.string.isRequired,
    pic: PropTypes.string,
  }).isRequired,
};
