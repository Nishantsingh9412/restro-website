/* eslint-disable react/prop-types */
import { Box, Circle, Flex, Stack, Text } from "@chakra-ui/react";
import { LuSoup } from "react-icons/lu";

// Helper function to calculate stock percentage
const calculatePercentage = (minQty, availableQty) => {
  if (availableQty === 0) return 0;
  return ((minQty / availableQty) * 100).toFixed(2);
};

// Component to render a single low stock item
const LowStockItem = ({ item, index, isLow }) => {
  // Calculate the stock percentage
  const percentage = calculatePercentage(
    item.minimum_quantity,
    item.available_quantity
  );

  // Render the progress bar
  const renderProgressBar = (percentage, isLow) => (
    <Box marginTop={"10px"}>
      <div
        style={{
          background: "white",
          height: "8px",
          borderRadius: "50px",
          width: "100%",
          display: "flex",
        }}
      >
        <div
          style={{
            background: isLow ? "red" : "green", // Color based on low stock condition
            height: "8px",
            borderRadius: "50px",
            width: `${percentage}%`,
          }}
        ></div>
      </div>
    </Box>
  );

  return (
    <Box
      key={index}
      minWidth={"275px"}
      maxW={"300px"}
      bg={"#f9f9f9"}
      boxShadow={"0 4px 8px rgba(0, 0, 0, 0.1)"}
      border={"1px solid #e2e8f0"}
      borderRadius={"lg"}
      padding={"20px"}
      transition={"transform 0.2s"}
      _hover={{ transform: "scale(1.05)" }}
    >
      {/* Header section with item name and last updated date */}
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize={"lg"} fontWeight={"semibold"} color={"#2d3748"}>
            {item.item_name}
          </Text>
          <Text fontSize={"sm"} fontWeight={"500"} color={"#718096"}>
            Last Updated: {item.updatedAt.split("T")[0]}
          </Text>
        </Box>
        <Box justifyContent={"end"}>
          <Box
            color={"#ee7213"}
            backgroundColor={"#fff5f5"}
            borderRadius={"full"}
            padding={"10px"}
          >
            <LuSoup size={"30"} />
          </Box>
        </Box>
      </Flex>

      {/* Stock status indicator */}
      <Flex justifyContent={"end"} marginTop={"20px"} marginBottom={"15px"}>
        <Flex alignItems={"center"}>
          <Circle
            size="10px"
            marginRight={"5px"}
            bg={isLow ? "red.500" : "green.500"}
          />
          <Text fontSize={"sm"} color={isLow ? "red.500" : "green.500"}>
            {isLow ? "Low Stock" : "In Stock"}
          </Text>
        </Flex>
      </Flex>

      {/* Render the progress bar */}
      {renderProgressBar(percentage, isLow)}

      {/* Footer section with quantity details and percentage */}
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        marginTop={"4"}
      >
        <Stack direction={"row"} spacing={1}>
          <Text fontSize={"sm"} color={"#4a5568"}>
            {`${item.minimum_quantity} / ${item.available_quantity}`}
          </Text>
          <Text fontSize={"sm"} color={"#a0aec0"} fontWeight={"500"}>
            Total Amount
          </Text>
        </Stack>
        <Box
          border={`2px solid ${isLow ? "red" : "green"}`}
          padding={"3px 6px"}
          borderRadius={"md"}
          fontSize={"sm"}
          color={isLow ? "red.500" : "green.500"}
        >
          {`${percentage}%`}
        </Box>
      </Flex>
    </Box>
  );
};

export default LowStockItem;
