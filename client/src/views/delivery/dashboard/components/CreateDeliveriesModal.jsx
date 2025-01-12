import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

function DeliveryModal() {
  const initialState = {
    recipientName: "",
    contactNumber: "",
    address: "",
    notes: "",
    orderId: "",
    pickupLocation: "",
    deliveryLocation: "",
    distance: "",
    estimatedTime: "",
    orderItems: "",
    customerName: "",
    customerContact: "",
    restaurantName: "",
    restaurantImage: "",
    paymentType: "",
    currentStatus: "",
    statusHistory: "",
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deliveryDetails, setDeliveryDetails] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Delivery Details:", deliveryDetails);
    // Add your API call or submission logic here
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Create Delivery
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Delivery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Recipient Name</FormLabel>
              <Input
                name="recipientName"
                value={deliveryDetails.recipientName}
                onChange={handleChange}
                placeholder="Enter recipient name"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Contact Number</FormLabel>
              <Input
                name="contactNumber"
                type="tel"
                value={deliveryDetails.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Delivery Address</FormLabel>
              <Textarea
                name="address"
                value={deliveryDetails.address}
                onChange={handleChange}
                placeholder="Enter delivery address"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Order ID</FormLabel>
              <Input
                name="orderId"
                value={deliveryDetails.orderId}
                onChange={handleChange}
                placeholder="Enter order ID"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Pickup Location</FormLabel>
              <Input
                name="pickupLocation"
                value={deliveryDetails.pickupLocation}
                onChange={handleChange}
                placeholder="Enter pickup location"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Delivery Location</FormLabel>
              <Input
                name="deliveryLocation"
                value={deliveryDetails.deliveryLocation}
                onChange={handleChange}
                placeholder="Enter delivery location"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Distance</FormLabel>
              <Input
                name="distance"
                value={deliveryDetails.distance}
                onChange={handleChange}
                placeholder="Enter distance"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Estimated Time</FormLabel>
              <Input
                name="estimatedTime"
                value={deliveryDetails.estimatedTime}
                onChange={handleChange}
                placeholder="Enter estimated time"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Order Items</FormLabel>
              <Textarea
                name="orderItems"
                value={deliveryDetails.orderItems}
                onChange={handleChange}
                placeholder="Enter order items"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Customer Name</FormLabel>
              <Input
                name="customerName"
                value={deliveryDetails.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Customer Contact</FormLabel>
              <Input
                name="customerContact"
                value={deliveryDetails.customerContact}
                onChange={handleChange}
                placeholder="Enter customer contact"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Restaurant Name</FormLabel>
              <Input
                name="restaurantName"
                value={deliveryDetails.restaurantName}
                onChange={handleChange}
                placeholder="Enter restaurant name"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Restaurant Image</FormLabel>
              <Input
                name="restaurantImage"
                value={deliveryDetails.restaurantImage}
                onChange={handleChange}
                placeholder="Enter restaurant image URL"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Payment Type</FormLabel>
              <Input
                name="paymentType"
                value={deliveryDetails.paymentType}
                onChange={handleChange}
                placeholder="Enter payment type"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Current Status</FormLabel>
              <Input
                name="currentStatus"
                value={deliveryDetails.currentStatus}
                onChange={handleChange}
                placeholder="Enter current status"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Status History</FormLabel>
              <Textarea
                name="statusHistory"
                value={deliveryDetails.statusHistory}
                onChange={handleChange}
                placeholder="Enter status history"
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
    </>
  );
}

export default DeliveryModal;
