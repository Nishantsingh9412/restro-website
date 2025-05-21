import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Radio,
  Stack,
  RadioGroup,
  Button,
} from "@chakra-ui/react";
import {
  setDineInInfo,
  updateDineInGuestName,
} from "../../../../redux/action/customerInfo";
import { useToast } from "../../../../contexts/useToast";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { orderMethods } from "../../../../utils/constant";
import { clearCart } from "../../../../redux/action/cartItems";

const DineInForm = ({ onProceed }) => {
  const showToast = useToast();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.customerInfo.dineIn);

  const {
    customerName,
    specialRequests,
    tableNumber,
    numberOfGuests,
    paymentMethod,
    orderMethod,
  } = formData;

  // Function to handle input changes
  const handleChange = (e) => {
    if (e.target.id === "numberOfGuests") {
      const numberOfGuests = parseInt(e.target.value, 10);
      if (numberOfGuests === 1) {
        dispatch(
          setDineInInfo({
            orderMethod: orderMethods.TOGETHER,
            customerName: "",
          })
        );
      }
      if (numberOfGuests > 20) {
        showToast("Number of guests should be between 1 and 20", "error");
        return;
      }
    }

    const { id, value } = e.target;
    dispatch(setDineInInfo({ [id]: value }));
  };

  // Function to handle order method change
  const handleOrderMethodChange = (value) => {
    // If the order method is changed to individual with 1 guest, show an error
    if (numberOfGuests && numberOfGuests < 2) {
      showToast(
        "Order method cannot be changed to individual with 1 guest",
        "info"
      );
      return;
    }
    dispatch(setDineInInfo({ orderMethod: value }));
    // Clear cart if order method is changed to individual
    if (value === orderMethods.INDIVIDUAL) {
      dispatch(clearCart());
    } else {
      dispatch(setDineInInfo({ customerName: "", guests: [] }));
    }
  };

  const handleGuestNameChange = (index) => (e) => {
    const { value } = e.target;
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
      dispatch(updateDineInGuestName({ index, name: value }));
      return;
    }

    // Check for duplicate names
    const duplicateName = formData.guests.some(
      (guest, guestIndex) =>
        guestIndex !== index &&
        guest?.name?.trim().toLowerCase() === trimmedValue.toLowerCase() &&
        trimmedValue.length >= 3
    );
    if (duplicateName) {
      showToast(
        `Guest name "${value}" is already taken. Please use a unique name.`,
        "error"
      );
      return;
    }
    dispatch(updateDineInGuestName({ index, name: value }));
  };

  // Function to validate the form data
  const validate = () => {
    const requiredFields = ["numberOfGuests", "orderMethod"];
    for (const field of requiredFields) {
      if (!formData[field]?.toString().trim()) {
        showToast(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        return false;
      }
    }

    if (orderMethod === orderMethods.INDIVIDUAL && numberOfGuests > 1) {
      const invalidGuest = formData.guests.some(
        (guest) => !guest?.name?.trim() || guest.name.trim().length < 3
      );
      if (invalidGuest) {
        showToast(
          "Each guest must have a name with at least 3 characters",
          "error"
        );
        return false;
      }
    } else if (orderMethod === orderMethods.TOGETHER && !customerName) {
      showToast("Please enter customer name", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    // Proceed to the next step if validation passes
    onProceed();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mt={5} mx={1}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {/* Number of Guests Input */}
          <FormControl id="numberOfGuests" mb={1} isRequired>
            <FormLabel>Number of Guests</FormLabel>
            <Input
              type="number"
              placeholder="Enter number of guests"
              value={numberOfGuests}
              min={1}
              max={20}
              onChange={handleChange}
              required={true}
            />
          </FormControl>
          {/* Table Number Input */}
          <FormControl id="tableNumber" mb={1}>
            <FormLabel>Table Number</FormLabel>
            <Input
              type="number"
              placeholder="Enter table number"
              value={tableNumber}
              onChange={handleChange}
              min={1}
            />
          </FormControl>
          {/* Order Method Radio Group */}
          <FormControl id="orderMethod" mb={3} isRequired>
            <FormLabel>Order Method</FormLabel>
            <RadioGroup
              value={orderMethod}
              name="orderMethod"
              onChange={handleOrderMethodChange}
            >
              <Stack direction="row">
                <Radio value="together">Order Together</Radio>
                <Radio value="individual">Order Individual</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          {/* Payment Method Radio Group */}
          <FormControl id="paymentMethod" mb={3}>
            <FormLabel>Payment Method</FormLabel>
            <RadioGroup
              value={paymentMethod}
              name={"paymentMethod"}
              onChange={(value) =>
                dispatch(setDineInInfo({ paymentMethod: value }))
              }
            >
              <Stack direction="row">
                <Radio value="cash">Cash</Radio>
                <Radio value="card">Card</Radio>
                <Radio value="paypal">PayPal</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {/* Customer Name Input */}
          {orderMethod === orderMethods.TOGETHER && (
            <FormControl id="customerName" mb={1} isRequired>
              <FormLabel>Customer Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter Full Name"
                value={customerName}
                onChange={handleChange}
                required={true}
                minLength={3}
                maxLength={50}
                pattern="^[a-zA-Z\s]+$"
              />
            </FormControl>
          )}
          {orderMethod === orderMethods.INDIVIDUAL &&
            numberOfGuests > 1 &&
            Array.from({ length: numberOfGuests }, (_, index) => (
              <Box key={index}>
                <FormControl id={`guestName-${index}`} mb={1} isRequired>
                  <FormLabel>Guest&apos;s {index + 1} Name</FormLabel>
                  <Input
                    value={formData.guests[index]?.name || ""}
                    type="text"
                    placeholder={`Enter name for Guest ${index + 1}`}
                    onChange={handleGuestNameChange(index)}
                    required={true}
                    minLength={3}
                    maxLength={50}
                    pattern="^[a-zA-Z\s]+$"
                  />
                </FormControl>
              </Box>
            ))}
          <FormControl id="specialRequests" mb={1}>
            <FormLabel>Special Request</FormLabel>
            <Input
              type="text"
              placeholder="Enter any special request"
              value={specialRequests}
              onChange={handleChange}
            />
          </FormControl>
        </SimpleGrid>
        <Button
          mt={6}
          width="full"
          background="#029CFF"
          color="white"
          _hover={{ bg: "blue.600" }}
          type="submit"
          // onClick={handleAutoFill}
        >
          Proceed To Menu
        </Button>
        <Box textAlign="center">
          {numberOfGuests && numberOfGuests > 0 && numberOfGuests <= 20 ? (
            <img
              src={`/tables/table-${numberOfGuests}.webp`}
              alt={`Table ${numberOfGuests}`}
            />
          ) : (
            <Text fontSize="sm" mt={2} color="gray.500">
              Enter a number of guest (1-20) to see the table layout.
            </Text>
          )}
        </Box>
      </Box>
    </form>
  );
};

DineInForm.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default DineInForm;
