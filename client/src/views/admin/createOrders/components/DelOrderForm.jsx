import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import MapInput from "../../../../components/mapInput/MapInput";
import { setDeliveryInfo } from "../../../../redux/action/customerInfo";
import { useToast } from "../../../../contexts/useToast";

const DeliveryOrderForm = ({ onProceed }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const formData = useSelector((state) => state.customerInfo.delivery);

  const validate = () => {
    const requiredFields = [
      "customerName",
      "phoneNumber",
      "address",
      "dropLocation",
      "dropLocationName",
    ];

    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        toast(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        document.querySelector(`[name="${field}"]`)?.focus();
        return false;
      }
    }

    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      toast("Please enter a valid 11-digit phone number", "error");
      return false;
    }

    if (formData.zip && !/^\d{5} ?$/.test(formData.zip)) {
      toast("Please enter a valid 5 digit zip code", "error");
      return false;
    }

    // Check if dropLocationName is not same with address, city, and zip
    if (
      formData.dropLocationName &&
      (!formData.dropLocationName?.includes(formData.city) ||
        !formData.dropLocationName?.includes(formData.zip))
    ) {
      toast("Drop location name should be same with  city, or zip", "error");
      return false;
    }

    return true;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onProceed();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      setDeliveryInfo({
        [name]: value,
      })
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleAddressSubmit}>
        <FormControl id="drop-location-heading">
          <FormLabel fontSize="xl" fontWeight="bold">
            Drop Location
          </FormLabel>
        </FormControl>
        <FormControl id="customerName" isRequired mt={4}>
          <FormLabel>Customer Name</FormLabel>
          <Input
            type="text"
            name="customerName"
            placeholder="Enter Full Name"
            value={formData.customerName}
            onChange={handleChange}
            required={true}
            maxLength={50}
            minLength={3}
          />
        </FormControl>
        <FormControl id="droplocation" isRequired mt={4}>
          <FormLabel>Drop Location</FormLabel>
          <Button
            aria-label="Open Map"
            borderRadius={"4px"}
            bg={"#029CFF"}
            color={"#fff"}
            _hover={{ background: "blue.500" }}
            onClick={onOpen}
          >
            Open Map Now
          </Button>
        </FormControl>
        {/* Map Modal To Select Drop Location */}
        {isOpen && (
          <MapInput
            data={{
              dropLocation: formData.dropLocation,
              dropLocationName: formData.dropLocationName || "",
            }}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
        <FormControl id="address" isRequired mt={4}>
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            name="address"
            placeholder="1234 Main St"
            value={formData.address}
            onChange={handleChange}
            required={true}
            maxLength={100}
            minLength={8}
          />
        </FormControl>

        <FormControl id="city">
          <FormLabel>City</FormLabel>
          <Input
            name="city"
            placeholder="Apartment, studio, or floor"
            value={formData.city}
            onChange={handleChange}
            maxLength={20}
            minLength={3}
          />
        </FormControl>

        <FormControl id="zip" mt={4} isRequired>
          <FormLabel>Zip</FormLabel>
          <Input
            name="zip"
            placeholder="Zip Code"
            type="text"
            value={formData.zip}
            onChange={handleChange}
            required={true}
            pattern="^\d{5}$"
            title="Please enter a valid 5 digit zip code"
            maxLength={5}
            minLength={5}
          />
        </FormControl>
        <FormControl id="phone-number" mt={4} isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="text"
            name="phoneNumber"
            placeholder="+49 12345678901"
            value={formData.phoneNumber}
            onChange={handleChange}
            required={true}
            pattern="^\d{11}$"
            title="Please enter a valid 10 digit phone number"
            maxLength={11}
            minLength={11}
          />
        </FormControl>

        <FormControl id="payment-method" mt={4}>
          <FormLabel>Payment Method</FormLabel>
          <RadioGroup
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={(value) =>
              handleChange({ target: { name: "paymentMethod", value } })
            }
          >
            <Stack direction="row">
              <Radio value="cash">Cash</Radio>
              <Radio value="card">Card</Radio>
              <Radio value="paypal">PayPal</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl id="note-from-customer" mt={4}>
          <FormLabel>Note from Customer</FormLabel>
          <Textarea
            type="text"
            name="noteFromCustomer"
            value={formData.noteFromCustomer}
            onChange={handleChange}
            placeholder="Any special instructions?"
          />
        </FormControl>
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            mt={4}
            width={"100%"}
            background={"#029CFF"}
            color={"white"}
            _hover={{ bg: "blue.600" }}
            type="submit"
          >
            Proceed To Menu
          </Button>
        </Box>
      </form>
    </Box>
  );
};

DeliveryOrderForm.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default DeliveryOrderForm;
