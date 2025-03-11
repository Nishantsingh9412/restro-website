import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  SimpleGrid,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../../contexts/useToast";
import { setFormData } from "../../../../../redux/action/dineInStepperForm";

// DineInForm component definition
const DineInForm = ({ goToNextStep }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  // Get form data from the Redux store
  const formData = useSelector((state) => state.dineInForm);

  // Destructure form data
  const {
    tableNumber,
    numberOfGuests,
    customerName,
    phoneNumber,
    emailAddress,
    specialRequests,
  } = formData;

  // Handle input changes and dispatch action to update form data in the Redux store
  const handleChange = useCallback(
    (field, value) => {
      dispatch(setFormData({ [field]: value }));
    },
    [dispatch]
  );

  // validate the form data
  const validate = () => {
    if (!tableNumber) {
      showToast("Please enter table number", "error");
      return false;
    }
    if (!numberOfGuests) {
      showToast("Please enter number of guests", "error");
      return false;
    }
    if (phoneNumber && phoneNumber.length !== 10) {
      showToast("Phone number must be 10 digits long", "error");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleDineInSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // console.log(formData);
    goToNextStep();
  };

  return (
    <form onSubmit={handleDineInSubmit}>
      <Box mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {/* Table Number Input */}
          <FormControl id="tableNumber" mb={4} isRequired>
            <FormLabel>Table Number</FormLabel>
            <Input
              type="number"
              placeholder="Enter table number"
              value={tableNumber}
              onChange={(e) => handleChange("tableNumber", e.target.value)}
              required={true}
            />
          </FormControl>

          {/* Number of Guests Input */}
          <FormControl id="numberOfGuests" mb={4} isRequired>
            <FormLabel>Number of Guests</FormLabel>
            <Input
              type="number"
              placeholder="Enter number of guests"
              value={numberOfGuests}
              onChange={(e) => handleChange("numberOfGuests", e.target.value)}
              required={true}
            />
          </FormControl>

          {/* Customer Name Input */}
          <FormControl id="customerName" mb={4}>
            <FormLabel>Customer Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter customer name (optional)"
              value={customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
            />
          </FormControl>

          {/* Phone Number Input */}
          <FormControl id="phoneNumber" mb={4}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="text"
              placeholder="Enter phone number (optional)"
              value={phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </FormControl>

          {/* Email Address Input */}
          <FormControl id="emailAddress" mb={4}>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              placeholder="Enter email address (optional)"
              value={emailAddress}
              onChange={(e) => handleChange("emailAddress", e.target.value)}
            />
          </FormControl>

          {/* Special Requests Input */}
          <FormControl id="specialRequests" mb={4}>
            <FormLabel>Special Requests</FormLabel>
            <Textarea
              placeholder="Enter any special requests (e.g., seating preferences, allergies)"
              value={specialRequests}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
            />
          </FormControl>
        </SimpleGrid>

        {/* Submit Button */}
        <Button colorScheme="cyan" type="submit" mt={4}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

// Prop types for DineInForm component
DineInForm.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
};
export default DineInForm;
