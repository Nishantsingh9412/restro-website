// CartItem Component to avoid duplication in rendering cart items
/* eslint-disable react/prop-types */
import { Box, Image, Text, Flex } from "@chakra-ui/react";
import { BiSolidTrash } from "react-icons/bi";
// import { calculatePrice } from "../../../../utils/constant";

// Helper function to format price with unit
const formatPrice = (value, unit) =>
  `${parseFloat(value).toFixed(2)} ${unit === "Euro" ? "€" : unit}`;

const CartItem = ({ item, onUpdate, onRemove }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb={3}>
      <Box p="6">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Image
              borderRadius="full"
              boxSize="50px"
              src={item?.pic}
              alt="Food-Image"
            />
            <Box ml="1rem">
              <Text fontWeight="semibold" as="h4" isTruncated>
                {item?.itemName}
              </Text>
              <Text fontWeight="semibold" as="h4" isTruncated>
                {item?.totalQuantity} X{" "}
                {formatPrice(item?.price, item?.priceUnit)}
              </Text>
            </Box>
            <BiSolidTrash
              size="20"
              style={{ marginLeft: "8px", cursor: "pointer", color: "red" }}
              onClick={() => onRemove(item.cartItemId)}
            />
          </Flex>
          <Flex
            background="#fa4a0c"
            color="white"
            gap="1rem"
            borderRadius="10px"
            p="4px 8px"
            alignItems="center"
          >
            <Text
              style={{
                cursor: "pointer",
                userSelect: "none",
                fontSize: "24px",
              }}
              onClick={() => onUpdate(item.cartItemId, 1)}
            >
              +
            </Text>
            <Text
              style={{
                cursor: "pointer",
                userSelect: "none",
                fontSize: "24px",
              }}
              onClick={() => onUpdate(item.cartItemId, -1)}
            >
              -
            </Text>
          </Flex>
        </Flex>

        <Box display="flex" justifyContent="end" mt="0.5rem">
          {formatPrice(item?.totalPrice, item?.priceUnit)}
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
