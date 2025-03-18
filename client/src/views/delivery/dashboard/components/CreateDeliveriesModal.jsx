import { useState } from "react";
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
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useToast } from "../../../../contexts/useToast";

export default function CreateDeliveryModal({ isOpen, onClose }) {
  const initialState = {
    orderId: "",
    customerName: "",
    contactNumber: "",
    address: "",
    notes: "",
    pickupLocation: "",
    deliveryLocation: "",
    orderItems: "",
    restaurantName: "",
    paymentMethod: "",
    // recipientName: "",
    // customerContact: "",
    // distance: "",
    // estimatedTime: "",
    // restaurantImage: "",
    // currentStatus: "",
    // statusHistory: "",
  };
  const requiredFields = Object.keys(initialState).filter(
    (field) => field !== "notes"
  );
  const showToast = useToast();
  const [deliveryDetails, setDeliveryDetails] = useState(initialState);

  const handleChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setDeliveryDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validate = () => {
    for (const field in initialState) {
      if (
        !deliveryDetails[field] ||
        (typeof deliveryDetails[field] === "string" &&
          deliveryDetails[field].trim() === "")
      ) {
        showToast(
          "Please enter " +
            field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase()),
          "error"
        );
        return false;
      }
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log("Delivery Details:", deliveryDetails);
    // Add your API call or submission logic here
    // onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Delivery</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {Object.keys(initialState).map((key) => (
            <FormControl
              mb={4}
              key={key}
              isRequired={requiredFields.includes(key)}
            >
              <FormLabel>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </FormLabel>
              {key === "address" ||
              key === "orderItems" ||
              key === "statusHistory" ? (
                <Textarea
                  name={key}
                  value={deliveryDetails[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}`}
                />
              ) : key === "paymentMethod" ? (
                <RadioGroup
                  value={deliveryDetails[key]}
                  name={key}
                  onChange={(value) =>
                    setDeliveryDetails((prevDetails) => ({
                      ...prevDetails,
                      [key]: value,
                    }))
                  }
                >
                  <Stack direction="row">
                    <Radio value="cash">Cash</Radio>
                    <Radio value="card">Card</Radio>
                    <Radio value="alreadyPaid">Already Paid</Radio>
                    <Radio value="online">Online</Radio>
                    <Radio value="paypal">Paypal</Radio>
                  </Stack>
                </RadioGroup>
              ) : (
                <Input
                  name={key}
                  value={deliveryDetails[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}`}
                />
              )}
            </FormControl>
          ))}
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
}

CreateDeliveryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
