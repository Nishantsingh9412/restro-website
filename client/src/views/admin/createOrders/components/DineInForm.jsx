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
import { useEffect, useState } from "react";
import { useToast } from "../../../../contexts/useToast";
import PropTypes from "prop-types";

const DineInForm = ({ onProceed }) => {
  const initialState = {
    customerName: "",
    specialRequests: "",
    tableNumber: "",
    numberOfGuests: "",
    paymentMethod: "",
    orderMethod: "",
    guests: [],
  };
  const [formData, setFormData] = useState(initialState);
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
    if (e.target.id === "numberOfGuests" && e.target.value > 20) {
      showToast("Number of guests should be between 1 and 20", "error");
      return;
    }
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    return () => {
      setFormData(initialState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
              setFormData((prev) => ({
                ...prev,
                paymentMethod: value,
              }))
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
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                orderMethod: value,
              }))
            }
          >
            <Stack direction="row">
              <Radio value="together">Order Together</Radio>
              <Radio value="individual">Order Individual</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        {orderMethod === "individual" &&
          Array.from({ length: numberOfGuests }, (_, index) => (
            <Box key={index}>
              <Text fontWeight="bold" mb={1}>
                Guest {index + 1}
              </Text>
              <FormControl id={`guestName-${index}`} mb={1} isRequired>
                <FormLabel>Guest Name</FormLabel>
                <Input
                  type="text"
                  placeholder={`Enter name for Guest ${index + 1}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => {
                      const updatedGuests = prev.guests || [];
                      updatedGuests[index] = {
                        ...(updatedGuests[index] || {}),
                        name: value,
                      };
                      return { ...prev, guests: updatedGuests };
                    });
                  }}
                  required={true}
                />
              </FormControl>
              {/* <FormControl id={`guestRequest-${index}`} mb={1}>
                <FormLabel>Special Request</FormLabel>
                <Input
                  type="text"
                  placeholder={`Enter special request for Guest ${index + 1}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => {
                      const updatedGuests = prev.guests || [];
                      updatedGuests[index] = {
                        ...(updatedGuests[index] || {}),
                        request: value,
                      };
                      return { ...prev, guests: updatedGuests };
                    });
                  }}
                />
              </FormControl> */}
            </Box>
          ))}
      </SimpleGrid>
      <Button
        mt={6}
        width="full"
        background="#029CFF"
        color="white"
        _hover={{ bg: "blue.600" }}
        onClick={onProceed}
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
  );
};
DineInForm.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default DineInForm;
