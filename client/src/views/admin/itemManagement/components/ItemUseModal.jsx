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
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

const ItemUseModal = ({ onOpen, isOpen, onClose, itemData, handleUpdate }) => {
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

  useEffect(() => {
    if (itemData) {
      const {
        item_name,
        item_unit,
        available_quantity,
        minimum_quantity,
        bar_code,
        existing_barcode_no,
        expiry_date,
        created_by,
      } = itemData;
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
    //cleanup function
    return () => {
      setFormData(initialItemState);
    };
  }, [itemData]);

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

    setFormData({
      ...formData,
      available_quantity: updatedQuantity,
    });

    // Handle form submission
    handleUpdate(formData);

    console.log(formData);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Item Use</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="name" mb={4}>
            <FormLabel>Name</FormLabel>
            <Input type="text" value={itemData?.item_name ?? ""} disabled />
          </FormControl>
          <FormControl id="available_quantity">
            <FormLabel>Available Quantity</FormLabel>
            <Input
              type="number"
              value={formData?.available_quantity}
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
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemUseModal;
