/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
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
import { toast } from "react-toastify";
import axios from "axios";
import { setFormData } from "../../../../../redux/action/stepperFormAction";
import MapInput from "../../../../../components/mapInput/MapInput";

const Address = ({ goToNextStep }) => {
  const dispatch = useDispatch();
  const [addressType, setAddressType] = useState("existing");
  const [countriesAll, setCountriesAll] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [statesAll, setStatesAll] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [citiesAll, setCitiesAll] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      if (!formData[field] || formData[field].trim() === "") {
        toast.error(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      toast.error("Please enter a valid zip code");
      return false;
    }

    return true;
  };

  const fetchData = async (url, setData, setLoading) => {
    setLoading(true);
    const response = await axios.get(url, {
      headers: { "X-CSCAPI-KEY": import.meta.env.VITE_APP_CSC_API_KEY },
    });
    setData(
      response.data.map((item) => ({
        value: item.name,
        label: item.name,
        iso2: item.iso2,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchData(
      "https://api.countrystatecity.in/v1/countries",
      setCountriesAll,
      () => {}
    );
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchData(
        `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`,
        setStatesAll,
        setStatesLoading
      );
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      fetchData(
        `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${selectedState}/cities`,
        setCitiesAll,
        setCitiesLoading
      );
    }
  }, [selectedCountry, selectedState]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(setFormData({ created_by: userId }));
    goToNextStep();
  };

  const handleChange = (field, value) => {
    dispatch(setFormData({ [field]: value }));
  };

  return (
    <Box p={4}>
      <form onSubmit={handleAddressSubmit}>
        <div className="flex flex-wrap gap-3 items-center">
          <FormControl id="customer-name" isRequired>
            <FormLabel>Pickup Location</FormLabel>
            {/* <RadioGroup onChange={setAddressType} value={addressType} mt={4}>
              <Radio value="existing" mr={4}>
                Use Existing Address
              </Radio>
              <Radio value="new">Enter New Address</Radio>
            </RadioGroup> */}
            <FormControl id="name" isRequired mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Customer Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </FormControl>

            <>
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

              {/* <SimpleGrid columns={3} spacing={4} mt={4}>
                <FormControl id="country" isRequired>
                  <FormLabel>Country</FormLabel>
                  <Select
                    options={countriesAll}
                    onChange={(e) => setSelectedCountry(e.iso2)}
                  />
                </FormControl>

                <FormControl id="state">
                  <FormLabel>State</FormLabel>
                  <Select
                    options={statesAll}
                    isDisabled={statesLoading}
                    isLoading={statesLoading}
                    onChange={(e) => {
                      setSelectedState(e.iso2);
                      handleChange("state", e.value);
                    }}
                  />
                </FormControl>

                <FormControl id="city">
                  <FormLabel>City</FormLabel>
                  <Select
                    options={citiesAll}
                    isDisabled={citiesLoading}
                    isLoading={citiesLoading}
                    onChange={(e) => handleChange("city", e.value)}
                  />
                </FormControl>
              </SimpleGrid> */}

              <FormControl id="zip" mt={4}>
                <FormLabel>Zip</FormLabel>
                <Input
                  placeholder="Zip"
                  type="number"
                  value={formData.zip}
                  onChange={(e) => handleChange("zip", e.target.value)}
                />
              </FormControl>
            </>
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
                dropLocation: formData.dropLocation || {},
                dropLocationName: formData.dropLocationName|| "",
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
            isLoading={loading}
            mt={4}
            width={"70%"}
            background={"#029CFF"}
            color={"white"}
            _hover={{ color: "#029CFF", bg: "whitesmoke" }}
            type="submit"
          >
            Add Address
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
