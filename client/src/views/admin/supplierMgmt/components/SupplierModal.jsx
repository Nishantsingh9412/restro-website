/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Image,
} from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  updateSupplierAction,
  addNewSupplierAction,
  getSingleSupplierAction,
} from "../../../../redux/action/supplier";

// SupplierModal component definition
const SupplierModal = ({ selectedId, isOpen, onClose, isEdit }) => {
  // Get user ID from local storage
  const localStorageId = JSON.parse(localStorage.getItem("ProfileData"))?.result
    ?._id;

  // Initial state for supplier data
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

  const dispatch = useDispatch();
  const [supplierData, setSupplierData] = useState(initialSupplierState);
  const [loading, setLoading] = useState(false);

  // Modal overlay component
  const OverlayOne = () => <ModalOverlay />;
  const [overlay] = useState(<OverlayOne />);

  // Fetch supplier data if editing
  useEffect(() => {
    if (selectedId && isEdit) {
      dispatch(getSingleSupplierAction(selectedId));
    }
  }, [selectedId, isEdit]);

  // Get selected supplier data from Redux store
  const selectedSupplierData = useSelector(
    (state) => state.supplierReducer.seletectedSupplier
  );

  // Update supplier data state when selected supplier data changes
  useEffect(() => {
    if (selectedSupplierData && isEdit) {
      setSupplierData({
        name: selectedSupplierData?.name || "",
        items: selectedSupplierData?.items || [],
        pic: selectedSupplierData?.pic || "",
        email: selectedSupplierData?.email || "",
        countryCode: selectedSupplierData?.countryCode || "",
        phone: selectedSupplierData?.phone || "",
        location: selectedSupplierData?.location || "",
        created_by: selectedSupplierData?.created_by || "",
      });
    }
  }, [selectedSupplierData, isEdit]);

  // Handle input field changes
  const handleInputChange = (field, value) => {
    setSupplierData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Handle phone input changes
  const handlePhoneInputChange = (phoneNumber) => {
    if (typeof phoneNumber === "string") {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      if (parsedPhoneNumber) {
        setSupplierData((prevData) => ({
          ...prevData,
          countryCode: parsedPhoneNumber.countryCallingCode,
          phone: parsedPhoneNumber.nationalNumber,
        }));
      }
    }
  };

  // Upload supplier image to Cloudinary
  const postSupplierImage = (pics) => {
    setLoading(true);
    if (!pics || (pics.type !== "image/jpeg" && pics.type !== "image/png")) {
      toast.error("Invalid image format. Please upload JPEG or PNG.");
      setLoading(false);
      return;
    }
    if (pics.size > 2000000) {
      toast.error("Image size should be less than 2 MB");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "restro-website");
    data.append("cloud_name", "dezifvepx");
    fetch("https://api.cloudinary.com/v1_1/dezifvepx/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setSupplierData((prevData) => ({
          ...prevData,
          pic: data.url.toString(),
        }));
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        toast.error("Error Uploading Image");
        setLoading(false);
      });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    supplierData.created_by = localStorageId;
    const isItemsArray = Array.isArray(supplierData.items);
    if (!isItemsArray) {
      supplierData.items = supplierData.items.split(", ");
    }

    const id = isEdit ? selectedSupplierData._id : undefined;

    const promise = dispatch(
      isEdit
        ? updateSupplierAction(id, supplierData)
        : addNewSupplierAction(supplierData)
    ).then((res) => {
      if (res.success) {
        onClose();
        return res.message;
      } else {
        throw new Error("Error in processing request");
      }
    });

    toast.promise(promise, {
      pending: isEdit ? "Updating Supplier..." : "Adding Supplier...",
      success: isEdit
        ? "Supplier Updated Successfully"
        : "Supplier Added Successfully",
      error: "Error in processing supplier",
    });
    handleClose();
  };

  // Handle modal close
  const handleClose = () => {
    setSupplierData(initialSupplierState);
    onClose();
  };

  // Render input field component
  const renderInputField = (label, field, type = "text", placeholder = "") => (
    <FormControl id={field} isRequired>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        value={supplierData[field]}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(field, e.target.value)}
        _focus={{ borderColor: "#ee7213", boxShadow: "0 0 0 1px #ee7213" }}
        background={"whiteAlpha.100"}
      />
    </FormControl>
  );

  // Auto-fill supplier data for testing
  const autoFillData = () => {
    setSupplierData({
      name: "Nizam",
      items: ["Tomato", "Cauliflower", "Brinjal", "Potato", "Onion", "Ginger"],
      pic: "",
      email: "nizamji100@gmail.com",
      countryCode: "91",
      phone: "9798425933",
      location: "Kolkata",
    });
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={handleClose}>
      {overlay}
      <ModalContent background={"#F5FFFE"} color={"black"}>
        <ModalHeader>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="10px"
          >
            <FaRegUser />
            <Text>{isEdit ? "Update Supplier" : "Add Supplier"}</Text>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            maxW="sm"
            m="auto"
            p="4"
            borderWidth="1px"
            borderRadius="lg"
            background={"whiteAlpha.100"}
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
                  inputProps={{
                    _focus: {
                      borderColor: "#ee7213",
                      boxShadow: "0 0 0 1px #ee7213",
                    },
                  }}
                />
              </FormControl>
              {renderInputField("Email", "email", "email")}
              {renderInputField("Location", "location")}
              <FormControl id="pic">
                <FormLabel>Upload Picture</FormLabel>
                <Input
                  type="file"
                  // variant="outline"
                  accept="image/*"
                  onChange={(e) => postSupplierImage(e.target.files[0])}
                  _focus={{
                    borderColor: "#ee7213",
                    boxShadow: "0 0 0 1px #ee7213",
                  }}
                  required={isEdit ? false : true}
                />
                {supplierData.pic || null}
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
              >
                {isEdit ? "Update Supplier" : "Add Supplier"}
              </Button>
            </form>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={autoFillData}>Auto Fill</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SupplierModal;
