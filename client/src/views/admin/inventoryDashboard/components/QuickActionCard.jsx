import { Box, Button, Heading, VStack } from "@chakra-ui/react";

const QuickActionCard = () => {
  return (
    <Box
      p={4}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      width={{ base: "100%", md: "40%" }}
    >
      <Heading size="md" mb={4}>
        Quick Actions
      </Heading>
      <VStack spacing={3}>
        <Button colorScheme="blue" width="full">
          Add New Item
        </Button>
        <Button colorScheme="blue" width="full">
          Scan Barcode
        </Button>
        <Button colorScheme="blue" width="full">
          View Reports
        </Button>
        <Button colorScheme="blue" width="full">
          Waste Entry
        </Button>
      </VStack>
    </Box>
  );
};

export default QuickActionCard;
