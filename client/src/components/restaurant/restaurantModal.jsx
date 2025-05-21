import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { addRestaurantDetails } from "../../api";
import { useToast } from "../../contexts/useToast";
import PropTypes from "prop-types";

const RestaurantModal = ({ isOpen, onClose }) => {
  const initialState = {
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    location: "",
    taxNumber: "",
    businessLicense: null,
    tradeLicense: null,
    coordinates: {
      lat: "",
      lng: "",
    },
  };
  const showToast = useToast();
  const [formData, setFormData] = useState(initialState);
  const [locationLoading, setLocationLoading] = useState(false);

  const formatLabel = (label) => {
    return (
      label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .charAt(0)
        .toUpperCase() + label.replace(/([a-z])([A-Z])/g, "$1 $2").slice(1)
    );
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleAutoLocate = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error obtaining location", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  };

  const validate = (formData) => {
    // Check if all fields are filled,
    for (const field in formData) {
      if (!formData[field]) {
        return formatLabel(field);
      }
    }
    if (formData.coordinates.lat === "" || formData.coordinates.lng === "") {
      return "Latitude and Longitude";
    }
  };

  const handleSubmit = async () => {
    // validate the form data
    const invalidField = validate(formData);
    if (invalidField) {
      showToast(`${invalidField} is required`, "error");
      return;
    }

    // Prepare form data for submission
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      if (key === "businessLicense" || key === "tradeLicense") {
        formDataToSubmit.append(key, formData[key]);
      } else if (key === "coordinates") {
        formDataToSubmit.append("lat", formData.coordinates.lat);
        formDataToSubmit.append("lng", formData.coordinates.lng);
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    }

    // Submit the form data
    try {
      const { data } = await addRestaurantDetails(formDataToSubmit);
      if (data.success) {
        showToast("Restaurant details added successfully", "success");
        onClose();
      } else if (data.error) {
        showToast(data.error.message, "error");
      } else {
        showToast("An unexpected error occurred", "error");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        showToast(
          "Failed to add restaurant details: " + error.response.data.error,
          "error"
        );
      } else {
        showToast(
          "Failed to add restaurant details: " + error.message,
          "error"
        );
      }
    }
  };

  const handleAutoFill = () => {
    const sampleData = {
      restaurantName: "Sample Restaurant",
      ownerName: "John Doe",
      email: "sample@example.com",
      phone: "1234567890",
      address: "123 Sample Street",
      location: "Sample City",
      taxNumber: "TAX123456",
      businessLicense: "sample-business-license.pdf",
      tradeLicense: "sample-trade-license.pdf",
      coordinates: {
        lat: "37.7749",
        lng: "-122.4194",
      },
    };
    setFormData(sampleData);
  };

  useEffect(() => {
    return () => {
      setFormData(initialState);
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Restaurant</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="restaurantName" isRequired mt={2}>
            <FormLabel>Restaurant Name</FormLabel>
            <Input
              value={formData.restaurantName}
              onChange={handleChange}
              type="text"
            />
          </FormControl>

          <FormControl id="ownerName" isRequired mt={2}>
            <FormLabel>Owner Name</FormLabel>
            <Input
              value={formData.ownerName}
              onChange={handleChange}
              type="text"
            />
          </FormControl>

          <FormControl id="email" isRequired mt={2}>
            <FormLabel>Email</FormLabel>
            <Input
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
          </FormControl>

          <FormControl id="phone" isRequired mt={2}>
            <FormLabel>Phone</FormLabel>
            <Input value={formData.phone} onChange={handleChange} type="tel" />
          </FormControl>

          <FormControl id="address" isRequired mt={2}>
            <FormLabel>Address</FormLabel>
            <Input
              value={formData.address}
              onChange={handleChange}
              type="text"
            />
          </FormControl>

          <FormControl id="location" isRequired mt={2}>
            <FormLabel>Location (City:Germany)</FormLabel>
            <Input
              value={formData.location}
              onChange={handleChange}
              type="text"
            />
          </FormControl>

          <FormControl id="taxNumber" isRequired mt={2}>
            <FormLabel>Tax Number (Steuernummer)</FormLabel>
            <Input
              value={formData.taxNumber}
              onChange={handleChange}
              type="tel"
            />
          </FormControl>

          <FormControl id="businessLicense" isRequired mt={2}>
            <FormLabel>Upload Business License</FormLabel>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData((prevData) => ({
                  ...prevData,
                  businessLicense: file,
                }));
              }}
            />
          </FormControl>

          <FormControl id="tradeLicense" isRequired mt={2}>
            <FormLabel>Trade License</FormLabel>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData((prevData) => ({
                  ...prevData,
                  tradeLicense: file,
                }));
              }}
            />
          </FormControl>

          <FormControl id="lat" isRequired mt={2}>
            <FormLabel>Latitude</FormLabel>
            <Input
              value={formData.coordinates.lat}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  coordinates: {
                    ...prevData.coordinates,
                    lat: e.target.value,
                  },
                }))
              }
              type="text"
            />
          </FormControl>

          <FormControl id="lng" isRequired mt={2}>
            <FormLabel>Longitude</FormLabel>
            <Input
              value={formData.coordinates.lng}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  coordinates: {
                    ...prevData.coordinates,
                    lng: e.target.value,
                  },
                }))
              }
              type="text"
            />
          </FormControl>

          <Button mt={4} onClick={handleAutoLocate}>
            {locationLoading ? "Locating..." : "Auto Locate"}
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAutoFill}>
            Auto Fill
          </Button>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default RestaurantModal;

RestaurantModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
