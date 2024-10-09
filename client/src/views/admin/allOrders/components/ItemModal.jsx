/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Select,
  Textarea,
  Text,
} from "@chakra-ui/react";

const ItemModal = (props) => {
  // Initial state for the form
  const initialState = {
    orderName: "",
    priceVal: "",
    priceUnit: "",
    description: "",
    isFavourite: "",
  };

  // Destructuring props
  const { isOpen, onClose, onSubmitData, isDrink, data } = props;

  // State hooks for form data and loading status
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Retrieve user ID from local storage
  const localUserId = JSON.parse(localStorage.getItem("ProfileData"));
  const userId = localUserId?.result?._id;

  // Function to auto-fill the form based on whether the item is a drink or not
  const autoFillform = () => {
    if (isDrink) {
      setFormState({
        orderName: "Coke",
        priceVal: 2,
        priceUnit: "Euro",
        description: "This is coke",
        isFavourite: true,
        pic: formState.pic,
      });
    } else {
      const orderNames = [
        "Mix Veg",
        "Normal Dal",
        "Paneer Tikka",
        "Dal Makhani",
      ];
      const priceVals = [10, 15, 20, 25];
      const descriptions = [
        "This is Mix Veg",
        "This is Normal Dal",
        "This is Paneer Tikka",
        "This is Dal Makhani",
      ];
      setFormState({
        orderName: orderNames[Math.floor(Math.random() * orderNames.length)],
        priceVal: priceVals[Math.floor(Math.random() * priceVals.length)],
        priceUnit: "Euro",
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        isFavourite: true,
        pic: formState.pic,
      });
    }
  };

  // Effect hook to update form state when data changes
  useEffect(() => {
    if (data != null) {
      setFormState((prevState) => ({
        ...prevState,
        orderName: data?.orderName || "",
        priceVal: data?.priceVal || "",
        priceUnit: data?.priceUnit || "",
        description: data?.description || "",
        isFavourite: data?.isFavourite,
        pic: data.pic,
        created_by: data.created_by,
      }));
    }
    // Cleanup function to reset form state
    return () => setFormState(initialState);
  }, [data]);

  // Function to handle modal close and reset form state
  const handleClose = () => {
    onClose();
    setFormState(initialState);
  };

  // Function to handle image upload
  const postOrderImage = async (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast.error("Please upload a picture");
      setLoading(false);
      return;
    }
    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast.error("Invalid image format");
      setLoading(false);
      return;
    }
    if (pics.size > 2000000) {
      setLoading(false);
      return toast.error("Image size should be less than 2 MB ");
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
        setFormState((prevState) => ({
          ...prevState,
          pic: data.url.toString(),
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return toast.error("Error Uploading Image to server");
      });
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    formState.isDrink = isDrink;
    formState.created_by = userId;
    if (
      formState.priceUnit === "" ||
      formState.orderName === "" ||
      formState.priceVal === ""
    ) {
      toast.error("Please fill all the required fields");
      return;
    }
    e.preventDefault();
    onSubmitData(formState);
    handleClose();
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalHeader>Add Drinks</ModalHeader>
          <Button onClick={autoFillform}>Auto Fill</Button>
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
                <FormControl id="orderName" isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    type="text"
                    name="orderName"
                    onChange={handleChange}
                    value={formState.orderName}
                    required={true}
                  />
                </FormControl>
                <FormControl id="priceVal" isRequired>
                  <FormLabel>Price Value</FormLabel>
                  <Input
                    type="number"
                    name="priceVal"
                    onChange={handleChange}
                    min={0}
                    value={formState.priceVal}
                    required={true}
                  />
                </FormControl>
                <FormControl id="priceUnit">
                  <FormLabel>Price Unit</FormLabel>
                  <Select
                    name="priceUnit"
                    onChange={handleChange}
                    value={formState.priceUnit}
                    required={true}
                  >
                    <option value=""> Select Price Unit </option>
                    <option value="Euro">Euro</option>
                  </Select>
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    type="text"
                    name="description"
                    onChange={handleChange}
                    value={formState.description}
                  />
                </FormControl>
                <FormControl id="isFavourite">
                  <FormLabel>Favourite</FormLabel>
                  <Select
                    name="isFavourite"
                    onChange={handleChange}
                    value={formState.isFavourite}
                  >
                    <option value=""> Select Favourite </option>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </Select>
                </FormControl>
                <FormControl id="pic">
                  <FormLabel>Upload Picture</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => postOrderImage(e.target.files[0])}
                  />
                </FormControl>
                <Text>{formState.pic}</Text>
                {data ? (
                  <>
                    <Button
                      mt="4"
                      mr={2}
                      colorScheme="blue"
                      type="submit"
                      isLoading={loading}
                    >
                      Update Item
                    </Button>
                    <Button mt="4" colorScheme="red" onClick={onClose}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    mt="4"
                    colorScheme="blue"
                    type="submit"
                    isLoading={loading}
                  >
                    Add Item
                  </Button>
                )}
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemModal;
