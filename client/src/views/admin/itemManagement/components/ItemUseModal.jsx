import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Box,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { useToast } from "../../../../contexts/useToast";
import PropTypes from "prop-types";

const ItemUseModal = ({ isOpen, onClose, itemData, itemsList, onSubmit }) => {
  const showToast = useToast();
  const [quantity, setQuantity] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(itemData ?? null);

  const handleOnClose = () => {
    onClose();
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedItem) {
      showToast("Please select an item", "error");
      return;
    }

    if (!quantity || quantity <= 0) {
      showToast("Please enter a valid quantity", "error");
      return;
    }

    if (quantity > selectedItem.availableQuantity) {
      showToast("Used quantity exceeds available stock", "error");
      return;
    }

    const formData = {
      itemId: selectedItem._id,
      quantityUsed: quantity,
    };

    // Submit to server
    onSubmit(formData);
    handleOnClose();
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setSearchInput("");
    setFilteredItems([]);
  };

  const resetForm = useCallback(() => {
    setQuantity(0);
    setSearchInput("");
    setFilteredItems([]);
    setSelectedItem(itemData ?? null);
  }, [itemData]);

  // Search for item
  useEffect(() => {
    if (!itemData && itemsList.length > 0 && searchInput) {
      const filtered = itemsList.filter((item) =>
        item?.itemName?.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [searchInput, itemData, itemsList]);

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Item Use</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {!itemData && itemsList.length > 0 && (
              <FormControl id="search" mb={4}>
                <FormLabel>Search Item</FormLabel>
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {filteredItems.length > 0 && (
                  <List mt={2} spacing={2}>
                    {filteredItems.map((item) => (
                      <ListItem
                        key={item._id}
                        onClick={() => handleItemSelect(item)}
                        cursor="pointer"
                        _hover={{ backgroundColor: "gray.100" }}
                      >
                        <Box p={2} borderWidth="1px" borderRadius="md">
                          <Text fontWeight="bold">{item?.itemName}</Text>
                          <Text fontSize="sm">
                            Available: {item?.availableQuantity}
                          </Text>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
                {searchInput && filteredItems.length === 0 && (
                  <Text mt={2} color="red.500">
                    No items found
                  </Text>
                )}
              </FormControl>
            )}

            <SimpleGrid columns={2} spacing={2}>
              <FormControl id="name" mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={selectedItem?.itemName || ""}
                  readOnly
                />
              </FormControl>
              <FormControl id="availableQuantity">
                <FormLabel>Available Quantity</FormLabel>
                <Input
                  type="number"
                  value={selectedItem?.availableQuantity ?? ""}
                  readOnly
                />
              </FormControl>
            </SimpleGrid>

            <FormControl id="quantity" isRequired>
              <FormLabel>Used Quantity</FormLabel>
              <Input
                type="number"
                min={1}
                max={selectedItem?.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Submit
            </Button>
            <Button variant="ghost" onClick={handleOnClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

ItemUseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemData: PropTypes.object,
  itemsList: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ItemUseModal;
