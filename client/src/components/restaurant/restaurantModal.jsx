import React, { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { addRestaurantDetails } from "../../api";

const RestaurantModal = ({ isOpen, onClose }) => {
  const initialState = {
    name: "",
    address: "",
    phone: "",
    coordinates: {
      lat: "",
      lng: "",
    },
  };
  const [formData, setFormData] = useState(initialState);
  const [locationLoading, setLocationLoading] = useState(false);

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
        return field?.charAt(0).toUpperCase() + field.slice(1);
      }
    }
  };

  const handleSubmit = async () => {
    // validate the form data
    const invalidField = validate(formData);
    if (invalidField) {
      toast.error(`${invalidField} is required`);
      return;
    }
    // Submit the form data
    try {
      const { data } = await addRestaurantDetails(formData);
      if (data.success) {
        toast.success("Restaurant details added successfully");
        onClose();
      } else if (data.error) {
        toast.error(data.error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(
          "Failed to add restaurant details: " + error.response.data.error
        );
      } else {
        toast.error("Failed to add restaurant details: " + error.message);
      }
    }
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
          {["name", "address", "phone"].map((field) => (
            <FormControl id={field} isRequired mt={4} key={field}>
              <FormLabel>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </FormLabel>
              <Input value={formData[field]} onChange={handleChange} />
            </FormControl>
          ))}
          <FormControl id="lat" isRequired mt={4}>
            <FormLabel>Latitude</FormLabel>
            <Input
              value={formData.coordinates.lat}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  coordinates: { ...prevData.coordinates, lat: e.target.value },
                }))
              }
            />
          </FormControl>
          <FormControl id="lng" isRequired mt={4}>
            <FormLabel>Longitude</FormLabel>
            <Input
              value={formData.coordinates.lng}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  coordinates: { ...prevData.coordinates, lng: e.target.value },
                }))
              }
            />
          </FormControl>
          <Button mt={4} onClick={handleAutoLocate}>
            {locationLoading ? "Locating..." : "Auto Locate"}
          </Button>
        </ModalBody>
        <ModalFooter>
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
