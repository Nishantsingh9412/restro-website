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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../../../../redux/action/stepperFormAction";
import MapInput from "../../../../../components/mapInput/MapInput";
import { useToast } from "../../../../../contexts/useToast";

const Address = ({ goToNextStep }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const userId = localData?.result?._id;
  const formData = useSelector((state) => state.form);

  const validate = () => {
    const requiredFields = [
      "name",
      "phoneNumber",
      "address",
      "paymentMethod",
      "deliveryMethod",
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
        return false;
      }
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      toast("Please enter a valid 10-digit phone number", "error");
      return false;
    }

    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      toast("Please enter a valid 5 digit zip code", "error");
      return false;
    }

    return true;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(setFormData({ created_by: userId }));
    goToNextStep();
  };

  const handleChange = (field, value) => {
    dispatch(setFormData({ [field]: value }));
  };
  const randomData = {
    name: "John Doe",
    phoneNumber: "1234567890",
    address: "1234 Main St",
    address2: "Apt 101",
    zip: "12345",
    paymentMethod: "cash",
    deliveryMethod: "delivery",
    // dropLocation: { lat: 40.712776, lng: -74.005974 },
    // dropLocationName: "New York, NY, USA",
    noteFromCustomer: "Leave at the front door.",
  };
  // For testing purposes
  const handleAutoComplete = () => {
    dispatch(setFormData(randomData));
  };

  return (
    <Box p={4}>
      <form onSubmit={handleAddressSubmit}>
        <div className="flex flex-wrap gap-3 items-center">
          <FormControl id="drop-location-heading">
            <FormLabel fontSize="xl" fontWeight="bold">
              Drop Location
            </FormLabel>
          </FormControl>
          <FormControl id="name" isRequired mt={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Customer Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormControl>

          <FormControl id="address" isRequired mt={4}>
            <FormLabel>Address Line 1</FormLabel>
            <Input
              type="text"
              placeholder="1234 Main St"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </FormControl>

          <FormControl id="address2">
            <FormLabel>Address Line 2</FormLabel>
            <Input
              placeholder="Apartment, studio, or floor"
              value={formData.address2}
              onChange={(e) => handleChange("address2", e.target.value)}
            />
          </FormControl>

          <FormControl id="zip" mt={4}>
            <FormLabel>Zip</FormLabel>
            <Input
              placeholder="Zip"
              type="number"
              value={formData.zip}
              onChange={(e) => handleChange("zip", e.target.value)}
            />
          </FormControl>
        </div>
        <FormControl id="phone-number" mt={4} isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="number"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </FormControl>

        <FormControl id="payment-method" mt={4}>
          <FormLabel>Payment Method</FormLabel>
          <RadioGroup
            value={formData.paymentMethod}
            onChange={(value) => handleChange("paymentMethod", value)}
          >
            <Stack direction="row">
              <Radio value="cash">Cash</Radio>
              <Radio value="card">Card</Radio>
              <Radio value="alreadyPaid">Already Paid</Radio>
              <Radio value="online">Online</Radio>
              <Radio value="paypal">Paypal</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl id="delivery-method" mt={4}>
          <FormLabel>Delivery Method</FormLabel>
          <RadioGroup
            value={formData.deliveryMethod}
            onChange={(value) => handleChange("deliveryMethod", value)}
          >
            <Stack direction="row">
              <Radio value="pickup">Pickup</Radio>
              <Radio value="delivery">Delivery</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl id="droplocation" isRequired mt={4}>
          <FormLabel>Drop Location</FormLabel>
          <Text>{formData?.dropLocationName}</Text>
          <Button
            borderRadius={"4px"}
            bg={"#029CFF"}
            color={"#fff"}
            _hover={{ background: "blue.500" }}
            onClick={onOpen}
          >
            Open Map Now
          </Button>

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
        </FormControl>

        <FormControl id="note-from-customer" mt={4}>
          <FormLabel>Note from Customer</FormLabel>
          <Textarea
            type="text"
            value={formData.noteFromCustomer}
            onChange={(e) => handleChange("noteFromCustomer", e.target.value)}
            placeholder="Any special instructions?"
          />
        </FormControl>
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            mt={4}
            width={"70%"}
            background={"#029CFF"}
            color={"white"}
            _hover={{ color: "#029CFF", bg: "whitesmoke" }}
            type="submit"
          >
            Add Address
          </Button>
          <Button
            m={4}
            width={"10%"}
            background={"#029CFF"}
            color={"white"}
            _hover={{ color: "#029CFF", bg: "whitesmoke" }}
            onClick={handleAutoComplete}
          >
            Auto Fill
          </Button>
        </Box>
      </form>
    </Box>
  );
};
Address.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
};

export default Address;
