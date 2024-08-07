import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Heading,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { setAddressAction } from "../../../../../redux/action/address";
import { setFormData } from "../../../../../redux/action/stepperFormAction";
import MapInput from "components/mapInput/MapInput";

const Address = ({ goToNextStep }) => {
  const dispatch = useDispatch();
  // const [paymentMethod, setPaymentMethod] = useState('online');
  // const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  // const [customerName, setCustomerName] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [address, setAddress] = useState('');
  // const [address2, setAddress2] = useState('');
  // const [city, setCity] = useState('');
  // const [state, setState] = useState('');
  // const [zip, setZip] = useState('');
  // const [noteFromCustomer, setNoteFromCustomer] = useState('');
  const [loading, setLoading] = useState(false);

  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const userId = localData?.result?._id;

  const formData = useSelector((state) => state.form);

  const validate = () => {
    if (!formData.name) {
      toast.error("Please enter customer name");
      return false;
    }
    if (!formData.phoneNumber) {
      toast.error("Please enter phone number");
      return false;
    }
    if (!formData.address) {
      toast.error("Please enter address");
      return false;
    }
    if (!formData.pickupLocation?.lat || !formData.pickupLocationName) {
      toast.error("Please select pickup location");
      return false;
    }
    return true;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    // setLoading(true);
    // const addressData = {
    //     name: customerName,
    //     phoneNumber,
    //     paymentMethod,
    //     deliveryMethod,
    //     address,
    //     address2,
    //     city,
    //     state,
    //     zip,
    //     noteFromCustomer,
    //     created_by: userId
    // }
    const addressData = {
      ...formData,
      created_by: userId,
    };
    console.log("AddressData", addressData);
    // dispatch(setAddressAction(addressData)).then((res) => {
    //     if (res.success) {
    //         goToNextStep();
    //         console.log('Address Submitted');
    //     } else {
    //         console.log('Address Not Submitted');
    //     }
    //     setLoading(false);
    // })
    goToNextStep();
  };

  const handleChange = (field, value) => {
    dispatch(setFormData({ [field]: value }));
  };

  const handleNewfields = (newFields) => dispatch(setFormData(newFields));

  return (
    <Box p={4}>
      {/* <Heading size="lg" mb={4}> Address </Heading> */}
      <form onSubmit={handleAddressSubmit}>
        <div className="flex flex-wrap gap-3 items-center">
          <FormControl id="customer-name" isRequired>
            <FormLabel>Pickup Location</FormLabel>
            <Input
              disabled
              type="text"
              placeholder="Pickup Location"
              value={formData.pickupLocationName}
              isRequired
            />
          </FormControl>
          <MapInput
            data={{
              pickupLocation: formData.pickupLocation,
              pickupLocationName: formData.pickupLocationName,
            }}
            onSubmit={(data) => handleNewfields(data)}
          />
        </div>

        <FormControl id="customer-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="Customer Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </FormControl>

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
            // onChange={setPaymentMethod}
            // value={paymentMethod}
            value={formData.paymentMethod}
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
            value={formData.deliveryMethod}
            onChange={(value) => handleChange("deliveryMethod", value)}
          >
            <Stack direction="row">
              <Radio value="pickup">Pickup</Radio>
              <Radio value="delivery">Delivery</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl id="address" isRequired>
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

        <SimpleGrid columns={3} spacing={4}>
          <FormControl id="city">
            <FormLabel>City</FormLabel>
            <Input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </FormControl>

          <FormControl id="state">
            <FormLabel>State</FormLabel>
            <Input
              placeholder="State"
              type="text"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </FormControl>

          <FormControl id="zip">
            <FormLabel>Zip</FormLabel>
            <Input
              placeholder="Zip"
              type="number"
              value={formData.zip}
              onChange={(e) => handleChange("zip", e.target.value)}
            />
          </FormControl>
        </SimpleGrid>

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
            isLoading={loading}
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

export default Address;
