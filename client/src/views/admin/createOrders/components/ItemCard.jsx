import { Box, Button, Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { formatToGermanCurrency } from "../../../../utils/utils";
const ItemCard = ({ item, handleShowItem }) => {
  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
    >
      <Flex alignItems="center" mb={4}>
        <img
          style={{
            borderRadius: "0.5rem",
            width: "80px",
            height: "80px",
            objectFit: "cover",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
          }}
          src={item?.pic || "/images/fallback.png"}
          alt={item?.itemName || "Food-Image"}
        />
        <Box ml={4} flex="1">
          <Text fontWeight="bold" fontSize="lg" color="teal.600">
            {item?.itemName}
          </Text>
          <Text fontSize="md" color="gray.600">
            {formatToGermanCurrency(item?.basePrice)}
          </Text>
        </Box>
      </Flex>
      <Button
        colorScheme="teal"
        variant="solid"
        w="full"
        onClick={() => handleShowItem(item)}
      >
        Show Item
      </Button>
    </Box>
  );
};

export default ItemCard;

ItemCard.propTypes = {
  item: PropTypes.object.isRequired,
  handleShowItem: PropTypes.func.isRequired,
};
