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
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.customerInfo.dineIn);
  const showToast = useToast();

  const {
    customerName,
    specialRequests,
    tableNumber,
    numberOfGuests,
    paymentMethod,
    orderMethod,
  } = formData;

  const handleChange = (e) => {
    if (e.target.id === "numberOfGuests") {
      const numberOfGuests = parseInt(e.target.value, 10);
      if (numberOfGuests === 1) {
        dispatch(setDineInInfo({ orderMethod: orderMethods.TOGETHER }));
      }
      if (numberOfGuests > 20) {
        showToast("Number of guests should be between 1 and 20", "error");
        return;
      }
    }

    const { id, value } = e.target;
    dispatch(setDineInInfo({ [id]: value }));
  };
  const validate = () => {
    const requiredFields = [
      "customerName",
      "numberOfGuests",
      "tableNumber",
      "paymentMethod",
      "orderMethod",
    ];

    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        showToast(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        return false;
      }
    }

    if (orderMethod === orderMethods.INDIVIDUAL && numberOfGuests > 1) {
      const invalidGuest = formData.guests.some(
        (guest) => !guest || !guest.name || !guest.name.trim()
      );
      if (invalidGuest) {
        showToast("Each guest must have a name", "error");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    // dispatch(setDineInInfo(formData));
    onProceed();
  };

  // const handleAutoFill = () => {
  //   dispatch(
  //     setDineInInfo({
  //       customerName: "John Doe",
  //       specialRequests: "Window seat",
  //       tableNumber: 5,
  //       numberOfGuests: 2,
  //       paymentMethod: "card",
  //       orderMethod: "individual",
  //     })
  //   );
  // };

  return (
    <form onSubmit={handleSubmit}>
      <Box mt={5} mx={1}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl id="customerName" mb={1} isRequired>
            <FormLabel>Customer Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter Customer Name"
              value={customerName}
              onChange={handleChange}
              required={true}
            />
          </FormControl>
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
          <FormControl id="tableNumber" mb={1} isRequired>
            <FormLabel>Table Number</FormLabel>
            <Input
              type="number"
              placeholder="Enter table number"
              value={tableNumber}
              onChange={handleChange}
              min={1}
              required={true}
            />
          </FormControl>

          <FormControl id="specialRequests" mb={1}>
            <FormLabel>Special Request</FormLabel>
            <Input
              type="text"
              placeholder="Enter any special request"
              value={specialRequests}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="paymentMethod" mb={3} isRequired>
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
                <Radio value="online">Online</Radio>
                <Radio value="paypal">Paypal</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl id="orderMethod" mb={3} isRequired>
            <FormLabel>Order Method</FormLabel>
            <RadioGroup
              value={orderMethod}
              name="orderMethod"
              onChange={(value) => {
                dispatch(setDineInInfo({ orderMethod: value }));
                // Clear cart if order method is changed to individual
                if (value === orderMethods.INDIVIDUAL) {
                  dispatch(clearCart());
                } else {
                  dispatch(setDineInInfo({ guests: [] }));
                }
              }}
            >
              <Stack direction="row">
                <Radio value="together">Order Together</Radio>
                <Radio value="individual">Order Individual</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          {orderMethod === orderMethods.INDIVIDUAL &&
            numberOfGuests > 1 &&
            Array.from({ length: numberOfGuests }, (_, index) => (
              <Box key={index}>
                <Text fontWeight="bold" mb={1}>
                  Guest {index + 1}
                </Text>
                <FormControl id={`guestName-${index}`} mb={1} isRequired>
                  <FormLabel>Guest Name</FormLabel>
                  <Input
                    value={formData.guests[index]?.name || ""}
                    type="text"
                    placeholder={`Enter name for Guest ${index + 1}`}
                    onChange={(e) => {
                      const value = e.target.value;
                      const duplicateName = formData.guests.some(
                        (guest, guestIndex) =>
                          guestIndex !== index &&
                          guest?.name?.trim().toLowerCase() ===
                            value.trim().toLowerCase()
                      );
                      if (duplicateName) {
                        showToast(
                          `Guest name "${value}" is already taken. Please use a unique name.`,
                          "error"
                        );
                        return;
                      }
                      dispatch(
                        updateDineInGuestName({
                          index,
                          name: value,
                        })
                      );
                    }}
                    required={true}
                  />
                </FormControl>
              </Box>
            ))}
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
