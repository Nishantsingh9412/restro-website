// CartItem Component to avoid duplication in rendering cart items
/* eslint-disable react/prop-types */
import {
  Box,
  Image,
  Text,
  Flex,
  Stack,
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BiSolidTrash } from "react-icons/bi";
import { calculatePrice } from "../../../../utils/constant";

// Helper function to format price with unit
const formatPrice = (value, unit) =>
  `${parseFloat(value).toFixed(2)} ${unit === "Euro" ? "€" : unit}`;

const CartItem = ({ item, onRemoveCompletely, onAdd, onRemove }) => {
  const dispatch = useDispatch();
  const [selectedSubItems, setSelectedSubItems] = useState(
    item?.subItems || []
  );

  const handleSubItemData = (subItems) => {
    dispatch({
      type: "UPDATE_ORDER_ITEM_TEMP_SUBITEM",
      data: { parentId: item._id, subItems },
    });
  };

  const handleCheckboxChange = (subItem) => {
    const updatedSubItems = selectedSubItems.some(
      (selected) => selected._id === subItem._id
    )
      ? selectedSubItems.filter((selected) => selected._id !== subItem._id)
      : [...selectedSubItems, subItem];

    setSelectedSubItems(updatedSubItems);
  };

  useEffect(() => {
    handleSubItemData(selectedSubItems);
    console.log("up[datd1");
  }, [selectedSubItems]);

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
                {item?.orderName}
              </Text>
              <Text fontWeight="semibold" as="h4" isTruncated>
                {item?.quantity} X{" "}
                {formatPrice(item?.priceVal, item?.priceUnit)}
              </Text>
            </Box>
            <BiSolidTrash
              size="20"
              style={{ marginLeft: "8px", cursor: "pointer", color: "red" }}
              onClick={() => onRemoveCompletely(item._id)}
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
              onClick={() => onAdd(item)}
            >
              +
            </Text>
            <Text
              style={{
                cursor: "pointer",
                userSelect: "none",
                fontSize: "24px",
              }}
              onClick={() => onRemove(item._id)}
            >
              -
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between">
          {item?.subItems?.length > 0 && (
            <Box mt={2}>
              <Text fontSize="sm" fontWeight="bold">
                Select Sub Items:
              </Text>
              <CheckboxGroup>
                <Stack direction="column" spacing={1} ml={1}>
                  {item?.subItems.map((subItem) => (
                    <Checkbox
                      key={subItem._id}
                      isChecked={selectedSubItems.some(
                        (item) => item._id === subItem._id
                      )}
                      onChange={() => handleCheckboxChange(subItem)}
                    >
                      {subItem.name} &times;{" "}
                      {formatPrice(subItem.price, item.priceUnit)}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>
          )}
        </Flex>
        <Box display="flex" justifyContent="end" mt="0.5rem">
          {formatPrice(calculatePrice(item, selectedSubItems), item?.priceUnit)}
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
