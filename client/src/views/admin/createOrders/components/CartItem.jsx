import { Box, Image, Text, Flex } from "@chakra-ui/react";
import { BiSolidTrash } from "react-icons/bi";
import { formatToGermanCurrency } from "../../../../utils/utils";
import PropTypes from "prop-types";

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
                {item?.totalQuantity} X {formatToGermanCurrency(item?.price)}
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
        <Flex justifyContent={"space-between"}>
          {console.log("cop", item?.selectedCustomizations?.length)}
          {console.table(item?.selectedCustomizations)}
          {item?.selectedCustomizations?.length > 0 ? (
            <Text fontWeight="" as="h5" mt={2} ml={1} isTruncated>
              {item?.selectedCustomizations
                .flatMap((c) => c.selectedOptions.map((option) => option.name))
                .join(", ")}
            </Text>
          ) : (
            <Box></Box>
          )}
          <Box display="flex" justifyContent="end" mt={"0.5rem"}>
            {formatToGermanCurrency(item?.totalPrice)}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
CartItem.propTypes = {
  item: PropTypes.shape({
    pic: PropTypes.string,
    itemName: PropTypes.string,
    totalQuantity: PropTypes.number,
    price: PropTypes.number,
    cartItemId: PropTypes.string,
    selectedCustomizations: PropTypes.arrayOf(
      PropTypes.shape({
        selectedOptions: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
          })
        ),
      })
    ),
    totalPrice: PropTypes.number,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
