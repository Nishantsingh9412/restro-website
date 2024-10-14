/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  addDelboyAction,
  updateSingleDelBoyAction,
} from "../../../../redux/action/delboy";

const DeliveryBoyModal = ({
  isOpen,
  onClose,
  initialData = {},
  isEditMode = false,
}) => {
  const dispatch = useDispatch();

  // State management with an object
  const [formState, setFormState] = useState({
    supplierName: "",
    phoneNo: "",
    countryCode: "",
    loading: false,
  });

  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const AdminUserId = localData?.result?._id;

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormState({
        supplierName: initialData.name || "",
        phoneNo: initialData.phone || "",
        countryCode: initialData.country_code || "",
        loading: false,
      });
    }
  }, [isEditMode, initialData]);

  // Update state with object spreading
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle phone input change and update phone number and country code
  const handlePhoneInputChange = (phoneNumber) => {
    if (typeof phoneNumber === "string") {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      if (parsedPhoneNumber) {
        setFormState((prevData) => ({
          ...prevData,
          countryCode: parsedPhoneNumber.countryCallingCode,
          phone: parsedPhoneNumber.nationalNumber,
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { supplierName, phoneNo, countryCode } = formState;
    if (!supplierName || !phoneNo || !countryCode) {
      toast.error("All fields are required");
      return;
    }

    setFormState((prevState) => ({ ...prevState, loading: true }));

    const delboyData = {
      name: supplierName,
      country_code: countryCode,
      phone: phoneNo,
      created_by: AdminUserId,
    };

    try {
      let res;
      if (isEditMode) {
        res = await dispatch(
          updateSingleDelBoyAction(initialData._id, delboyData)
        );
      } else {
        res = await dispatch(addDelboyAction(delboyData));
      }

      if (res.success) {
        toast.success(res.message);
        resetForm(); // Clear form after submission
        onClose(); // Close modal
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while processing the request", error);
    } finally {
      setFormState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const autoFill = () => {
    setFormState({
      supplierName: "John Doe",
      phoneNo: "+911234567890",
      countryCode: "+91",
    });
  };

  // Reset form state
  const resetForm = () => {
    setFormState({
      supplierName: "",
      phoneNo: "",
      countryCode: "",
      loading: false,
    });
  };

  const handleOnClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? "Edit Delivery Boy" : "Add Delivery Boy"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {/* Supplier Name Input */}
            <FormControl id="supplierName" isRequired>
              <FormLabel>Supplier Name</FormLabel>
              <Input
                type="text"
                name="supplierName"
                value={formState.supplierName}
                onChange={handleInputChange}
                placeholder="Enter supplier name"
                _focus={{
                  borderColor: "#ee7213",
                  boxShadow: "0 0 0 1px #ee7213",
                }}
              />
            </FormControl>

            {/* Phone Number Input with country code parsing */}
            <FormControl id="phone" isRequired mt="4">
              <FormLabel>Phone</FormLabel>
              <Box borderRadius="md" overflow="hidden">
                <PhoneInput
                  international
                  defaultCountry="DE"
                  value={formState.phoneNo}
                  onChange={handlePhoneInputChange}
                  placeholder="Enter phone number"
                  inputComponent={Input}
                  inputProps={{
                    _focus: {
                      borderColor: "#ee7213",
                      boxShadow: "0 0 0 1px #ee7213",
                    },
                  }}
                />
              </Box>
            </FormControl>

            {/* Submit Button */}
            <Button
              mt="4"
              bg="#ee7213"
              color="white"
              isLoading={formState.loading}
              type="submit"
              _hover={{ bg: "#ff8c42" }}
              marginBottom="1rem"
            >
              {isEditMode ? "Update Delivery Boy" : "Add Delivery Boy"}
            </Button>
            <Button onClick={autoFill}>Auto Fill</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeliveryBoyModal;
