import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateSingleItemAction } from "../../../../redux/action/Items";
import { use } from "react";

const ItemUseModal = ({ isOpen, onClose, itemData, itemsList }) => {
  const initialItemState = {
    item_name: "",
    item_unit: "",
    available_quantity: 0,
    minimum_quantity: 0,
    bar_code: "",
    existing_barcode_no: "",
    expiry_date: "",
    created_by: "",
  };
  const [quantity, setQuantity] = useState(0);
  const [formData, setFormData] = useState(initialItemState);
  const [selectedItem, setSelectedItem] = useState(itemData ?? null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  console.log("itemData", itemData);

  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem("ProfileData"))?.result?._id;

  useEffect(() => {
    if (selectedItem) {
      const {
        item_name,
        item_unit,
        available_quantity,
        minimum_quantity,
        bar_code,
        existing_barcode_no,
        expiry_date,
        created_by,
      } = selectedItem;
      setFormData({
        item_name: item_name || "",
        item_unit: item_unit,
        available_quantity: available_quantity || 0,
        minimum_quantity: minimum_quantity || 0,
        bar_code: bar_code || "",
        existing_barcode_no: existing_barcode_no || "",
        expiry_date: expiry_date?.split("T")[0] || "",
        created_by: created_by || "",
      });
    }
  }, [selectedItem]);

  // Search for particular item by name
  useEffect(() => {
    if (!itemData && itemsList.length > 0 && searchInput) {
      const filtered = itemsList.filter((item) =>
        item.item_name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [searchInput, itemData, itemsList]);

  const handleOnClose = () => {
    onClose();
    resetForm();
  };

  const handleSubmit = () => {
    if (!quantity) {
      toast.error("Please enter a quantity");
      return;
    }

    const updatedQuantity = formData.available_quantity - quantity;
    if (updatedQuantity < 0) {
      toast.error("Quantity cannot be less than zero");
      return;
    }

    const updatedFormData = {
      ...formData,
      available_quantity: updatedQuantity,
      created_by: userId,
    };

    // Handle form submission
    handleUpdate(updatedFormData);

    console.log(updatedFormData);
    handleOnClose();
  };

  const handleUpdate = (updatedData) => {
    dispatch(updateSingleItemAction(selectedItem?._id, updatedData))
      .then(() => {
        toast.success("Item updated successfully");
      })
      .catch((error) => {
        toast.error("Failed to update item: " + error.message);
      });
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setSearchInput("");
    setFilteredItems([]);
  };

  const resetForm = () => {
    setFormData(initialItemState);
    setQuantity(0);
    setSearchInput("");
    setFilteredItems([]);
    setSelectedItem(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Item Use</ModalHeader>
        <ModalCloseButton />
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
                        <Text fontWeight="bold">{item.item_name}</Text>
                        {/* <Text fontSize="sm">Unit: {item.item_unit}</Text> */}
                        <Text fontSize="sm">
                          Available: {item.available_quantity}
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
          <FormControl id="name" mb={4}>
            <FormLabel>Name</FormLabel>
            <Input type="text" value={formData.item_name} disabled />
          </FormControl>
          <FormControl id="available_quantity">
            <FormLabel>Available Quantity</FormLabel>
            <Input
              type="number"
              value={formData.available_quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </FormControl>
          <FormControl id="quantity">
            <FormLabel>Used Quantity</FormLabel>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="ghost" onClick={handleOnClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemUseModal;
