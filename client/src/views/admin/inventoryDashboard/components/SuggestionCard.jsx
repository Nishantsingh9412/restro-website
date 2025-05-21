import {
  Box,
  Button,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const SuggestionCard = ({ items }) => {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg="gray.50"
      width="100%"
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" color="teal.600">
          Reorder Suggestion
        </Heading>
        <Box borderBottomWidth="1px" borderColor="gray.200" />
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="blue" size="sm">
            <Thead>
              <Tr>
                <Th>Item Name</Th>
                <Th>Quantity</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items && items.length > 0 ? (
                items
                  .slice(0, 3)
                  .map(({ id, item_name, available_quantity, onOrder }) => (
                    <Tr key={id}>
                      <Td fontWeight="medium">{item_name}</Td>
                      <Td>{available_quantity}</Td>
                      <Td>
                        <Button
                          colorScheme="teal"
                          size="xs"
                          onClick={onOrder}
                          variant="solid"
                        >
                          Order Now
                        </Button>
                      </Td>
                    </Tr>
                  ))
              ) : (
                <Tr>
                  <Td colSpan="3" textAlign="center" fontStyle="italic">
                    No low stock items to display
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
};
SuggestionCard.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      item_name: PropTypes.string.isRequired,
      available_quantity: PropTypes.number.isRequired,
      onOrder: PropTypes.func.isRequired,
    })
  ),
};

export default SuggestionCard;
