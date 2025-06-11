import { useEffect, useState } from "react";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Box,
  Text,
  Input,
  Image,
  Modal,
  Button,
  FormLabel,
  ModalBody,
  ModalHeader,
  FormControl,
  ModalContent,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { useToast } from "../../../../../contexts/useToast";
import PropTypes from "prop-types";

const initialSupplierState = {
  name: "",
  items: [],
  pic: "",
  email: "",
  countryCode: "",
  phone: "",
  location: "",
  created_by: "",
};

const SupplierModal = ({ selectedSupplierData, isOpen, onClose, onSubmit }) => {
  const showToast = useToast();
  const [supplierData, setSupplierData] = useState(initialSupplierState);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(selectedSupplierData && selectedSupplierData._id);

  useEffect(() => {
    if (isEdit) {
      setSupplierData({
        ...initialSupplierState,
        ...selectedSupplierData,
        items: selectedSupplierData?.items || [],
      });
    } else {
      setSupplierData(initialSupplierState);
    }
  }, [selectedSupplierData, isEdit]);

  const handleInputChange = (field, value) => {
    setSupplierData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneInputChange = (phoneNumber) => {
    if (typeof phoneNumber === "string") {
      const parsed = parsePhoneNumber(phoneNumber);
      if (parsed) {
        setSupplierData((prev) => ({
          ...prev,
          countryCode: parsed.countryCallingCode,
          phone: parsed.nationalNumber,
        }));
      }
    }
  };

  const postSupplierImage = (file) => {
    if (!file || !["image/jpeg", "image/png"].includes(file.type)) {
      showToast("Invalid image format. Please upload JPEG or PNG.", "error");
      return;
    }
    if (file.size > 2000000) {
      showToast("Image size should be less than 2 MB", "info");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "restro-website");
    data.append("cloud_name", "dezifvepx");
    fetch("https://api.cloudinary.com/v1_1/dezifvepx/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setSupplierData((prev) => ({ ...prev, pic: data.url.toString() }));
      })
      .catch(() => showToast("Error Uploading Image", "error"))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const items =
      Array.isArray(supplierData.items) && supplierData.items.length
        ? supplierData.items
        : supplierData.items
        ? supplierData.items.split(",").map((i) => i.trim())
        : [];
    const payload = { ...supplierData, items };

    // Dispatch your add or update action here
    onSubmit(payload);
  };

  const renderInputField = (label, field, type = "text", placeholder = "") => (
    <FormControl id={field} isRequired>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        value={supplierData[field]}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(field, e.target.value)}
        background="whiteAlpha.100"
      />
    </FormControl>
  );

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalContent background="#F5FFFE" color="black">
        <ModalHeader>
          <Flex justify="center" align="center" gap="10px">
            <FaRegUser />
            <Text>{isEdit ? "Update Supplier" : "Add Supplier"}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            maxW="sm"
            m="auto"
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            background="whiteAlpha.100"
          >
            <form onSubmit={handleSubmit}>
              {renderInputField("Supplier Name", "name")}
              {renderInputField(
                "Items (comma-separated)",
                "items",
                "text",
                "Tomato, Cauliflower, Brinjal"
              )}
              <FormControl id="phone">
                <FormLabel>Phone</FormLabel>
                <PhoneInput
                  international
                  defaultCountry="DE"
                  style={{ width: "100%" }}
                  onChange={handlePhoneInputChange}
                  placeholder="Phone"
                  value={
                    supplierData.phone
                      ? `+${supplierData.countryCode} ${supplierData.phone}`
                      : ""
                  }
                  inputComponent={Input}
                />
              </FormControl>
              {renderInputField("Email", "email", "email")}
              {renderInputField("Location", "location")}
              <FormControl id="pic">
                <FormLabel>Upload Picture</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => postSupplierImage(e.target.files[0])}
                  required={!isEdit}
                />
              </FormControl>
              {supplierData.pic && (
                <Box mt={4}>
                  <FormLabel>Image Preview</FormLabel>
                  <Image
                    src={supplierData.pic}
                    alt="Supplier Picture"
                    boxSize="150px"
                    objectFit="cover"
                  />
                </Box>
              )}
              <Button
                mt="4"
                bg="#ee7213"
                color="white"
                _hover={{ bg: "#ff8c42" }}
                type="submit"
                isLoading={loading}
                w="100%"
              >
                {isEdit ? "Update Supplier" : "Add Supplier"}
              </Button>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
SupplierModal.propTypes = {
  selectedSupplierData: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SupplierModal;
