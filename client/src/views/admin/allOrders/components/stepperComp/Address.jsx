import { useCallback } from "react";
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
  SimpleGrid,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setFormData } from "../../../../../redux/action/stepperFormAction";

const Address = ({ goToNextStep }) => {
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);

  const formData = useSelector((state) => state.form);
  const {
    name,
    phoneNumber,
    paymentMethod,
    deliveryMethod,
    address,
    address2,
    city,
    state,
    zip,
    noteFromCustomer,
  } = formData;

  const validate = useCallback(() => {
    if (!name) {
      toast.error("Please enter customer name");
      return false;
    }
    if (!phoneNumber) {
      toast.error("Please enter phone number");
      return false;
    }
    if (!address) {
      toast.error("Please enter address");
      return false;
    }
    return true;
  }, [name, phoneNumber, address]);

  const handleAddressSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!validate()) {
        return;
      }
      // const addressData = {
      // ...formData,
      // created_by: userId,
      // };
      // console.log("AddressData", addressData);
      goToNextStep();
    },
    [validate, goToNextStep]
  );

  const handleChange = useCallback(
    (field, value) => {
      dispatch(setFormData({ [field]: value }));
    },
    [dispatch]
  );

  return (
    <Box p={4}>
      <form onSubmit={handleAddressSubmit}>
        <FormControl id="customer-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </FormControl>

        <FormControl id="phone-number" mt={4} isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="number"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </FormControl>

        <FormControl id="payment-method" mt={4}>
          <FormLabel>Payment Method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(value) => handleChange("paymentMethod", value)}
          >
            <Stack direction="row">
              <Radio value="online">Online</Radio>
              <Radio value="offline">Offline</Radio>
              <Radio value="cash">Cash</Radio>
              <Radio value="card">Card</Radio>
              <Radio value="alreadyPaid">Already Paid</Radio>
              <Radio value="masterCard">MasterCard</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl id="delivery-method" mt={4}>
          <FormLabel>Delivery Method</FormLabel>
          <RadioGroup
            value={deliveryMethod}
            onChange={(value) => handleChange("deliveryMethod", value)}
          >
            <Stack direction="row">
              <Radio value="pickup">Pickup</Radio>
              <Radio value="delivery">Delivery</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl id="address" isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            placeholder="1234 Main St"
            value={address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </FormControl>

        <FormControl id="address2">
          <FormLabel>Address 2</FormLabel>
          <Input
            placeholder="Apartment, studio, or floor"
            value={address2}
            onChange={(e) => handleChange("address2", e.target.value)}
          />
        </FormControl>

        <SimpleGrid columns={3} spacing={4}>
          <FormControl id="city">
            <FormLabel>City</FormLabel>
            <Input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </FormControl>

          <FormControl id="state">
            <FormLabel>State</FormLabel>
            <Input
              placeholder="State"
              type="text"
              value={state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </FormControl>

          <FormControl id="zip">
            <FormLabel>Zip</FormLabel>
            <Input
              placeholder="Zip"
              type="number"
              value={zip}
              onChange={(e) => handleChange("zip", e.target.value)}
            />
          </FormControl>
        </SimpleGrid>

        <FormControl id="note-from-customer" mt={4}>
          <FormLabel>Note from Customer</FormLabel>
          <Textarea
            type="text"
            value={noteFromCustomer}
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
            {" "}
            Add Address{" "}
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
