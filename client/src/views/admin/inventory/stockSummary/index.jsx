import { useInventoryStock } from "../../../../hooks/useInventoryStock";
import LowStockItem from "./components/StockCard";
import {
  Box,
  Heading,
  Flex,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const StockSummary = () => {
  const { allStockItems, lowStockItems, isLoading } = useInventoryStock();

  const sectionBg = useColorModeValue("gray.100", "gray.700");
  const sectionShadow = "0 4px 8px rgba(0, 0, 0, 0.07)";

  if (isLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <>
      {/* Low Stock Alert Section */}
      <Box mt={{ base: 8, md: 12 }}>
        <Heading
          ml={2}
          fontWeight="900"
          color="blue.400"
          fontSize={{ base: "xl", md: "2xl" }}
        >
          Low Stocks Alert
        </Heading>
        <Box
          mt={4}
          p={6}
          bg={sectionBg}
          borderRadius="lg"
          boxShadow={sectionShadow}
        >
          {lowStockItems?.length === 0 ? (
            <Text color="gray.500" fontWeight="bold">
              No low stock items!
            </Text>
          ) : (
            <Flex wrap="wrap" gap={6}>
              {lowStockItems.map((item, index) => (
                <LowStockItem
                  key={index}
                  item={item}
                  index={index}
                  isLow={true}
                />
              ))}
            </Flex>
          )}
        </Box>
      </Box>

      {/* Overall Stocks Section */}
      <Box mt={{ base: 8, md: 12 }}>
        <Heading
          ml={2}
          fontWeight="900"
          color="blue.400"
          fontSize={{ base: "xl", md: "2xl" }}
        >
          Overall Stocks
        </Heading>
        <Box
          mt={4}
          p={6}
          bg={sectionBg}
          borderRadius="lg"
          boxShadow={sectionShadow}
        >
          {allStockItems?.length === 0 ? (
            <Text color="gray.500" fontWeight="bold">
              No stock items found!
            </Text>
          ) : (
            <Flex wrap="wrap" gap={6}>
              {allStockItems.map((item, index) => (
                <LowStockItem
                  key={index}
                  item={item}
                  index={index}
                  isLow={false}
                />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </>
  );
};

export default StockSummary;
