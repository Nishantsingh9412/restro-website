import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useToast } from "../../../../contexts/useToast";
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
  const showToast = useToast();
  // State management with an object
  const [formState, setFormState] = useState({
    supplierName: "",
    phone: "",
    countryCode: "",
    loading: false,
  });

  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const AdminUserId = localData?.result?._id;

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormState({
        supplierName: initialData.name || "",
        phone: initialData.phone || "",
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
    setFormState((prevData) => ({
      ...prevData,
      phone: phoneNumber,
    }));

    if (typeof phoneNumber === "string") {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      if (parsedPhoneNumber) {
        setFormState((prevData) => ({
          ...prevData,
          countryCode: parsedPhoneNumber.countryCallingCode,
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formState);

    const { supplierName, phone, countryCode } = formState;
    if (!supplierName || !phone || !countryCode) {
      showToast("All fields are required", "error");
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      showToast("Phone number must be at least 10 characters", "error");
      return;
    }

    setFormState((prevState) => ({ ...prevState, loading: true }));

    const delboyData = {
      name: supplierName,
      country_code: countryCode,
      phone: phone,
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
        showToast(res.message, "success");
        resetForm(); // Clear form after submission
        onClose(); // Close modal
      } else {
        showToast(res.message, "error");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setFormState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const autoFill = () => {
    setFormState({
      supplierName: "John Doe",
      phone: "+491234567890",
      countryCode: "49",
    });
  };

  // Reset form state
  const resetForm = () => {
    setFormState({
      supplierName: "",
      phone: "",
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
                  value={formState.phone}
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

DeliveryBoyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isEditMode: PropTypes.bool,
};

export default DeliveryBoyModal;
