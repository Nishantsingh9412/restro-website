import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { calculatePrice } from "../../../../utils/constant";

function CartSummary({ cartItems, totalAmount }) {
  const textColor = useColorModeValue("gray.800", "white");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <>
      <Box mb={8}>
        <Heading size="md" mb={4}>
          Your Cart Items
        </Heading>
        {cartItems?.map((item, index) => (
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
                    {item.orderName + " "}
                    {item?.selectedSubItems?.length > 0 && (
                      <Text
                        as="span"
                        fontSize={"sm"}
                        color={textColor}
                        fontWeight={"normal"}
                      >
                        (
                        {item?.selectedSubItems?.map((subItem, index) => (
                          <Text key={index} as={"span"}>
                            {subItem.name +
                              (index === item.selectedSubItems.length - 1
                                ? ""
                                : ", ")}
                          </Text>
                        ))}
                        )
                      </Text>
                    )}
                  </Text>
                  <Text
                    fontSize="md"
                    fontWeight="medium"
                    as="h5"
                    lineHeight="tight"
                    color={textColor}
                    isTruncated
                  >
                    {item.quantity} X{" "}
                    {item.priceVal +
                      item?.selectedSubItems?.reduce(
                        (acc, item) => acc + item.price,
                        0
                      )}{" "}
                    {item.priceUnit}
                  </Text>
                </Box>
              </Box>
              <Text fontWeight="medium" color={textColor}>
                {calculatePrice(item)} {item.priceUnit}
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
    </>
  );
}

export default CartSummary;

CartSummary.propTypes = {
  cartItems: PropTypes.array,
  totalAmount: PropTypes.number,
};
