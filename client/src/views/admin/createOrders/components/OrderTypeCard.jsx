import { Box, Icon, Text, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  MdDeliveryDining,
  MdDinnerDining,
  MdTakeoutDining,
} from "react-icons/md";
import { orderTypes } from "../../../../utils/constant";

const OrderTypeCard = ({ type, setSelectedOrderType, isSelected }) => {
  const getDescriptionAndIcon = (type) => {
    switch (type) {
      case orderTypes.DINE_IN:
        return {
          description: "Enjoy your meal at our place",
          icon: MdDinnerDining,
        };
      case orderTypes.TAKE_AWAY:
        return {
          description: "Take your meal with you",
          icon: MdTakeoutDining,
        };
      case orderTypes.DELIVERY:
        return {
          description: "Get your meal delivered",
          icon: MdDeliveryDining,
        };
      default:
        return {
          description: "",
          icon: null,
        };
    }
  };

  const { description, icon } = getDescriptionAndIcon(type);

  return (
    <Box
      key={type}
      w="250px"
      h="250px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      bg={isSelected ? "blue.50" : "gray.50"}
      border={isSelected ? "2px solid" : "1px solid"}
      borderColor={isSelected ? "blue.400" : "gray.200"}
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "lg",
      }}
      onClick={() => setSelectedOrderType(type)}
    >
      <Icon as={icon} w={12} h={12} color="blue.400" />
      <VStack spacing={2} mt={4}>
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          {type[0]?.toUpperCase() + type.slice(1)}
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};
OrderTypeCard.propTypes = {
  type: PropTypes.string.isRequired,
  setSelectedOrderType: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default OrderTypeCard;
