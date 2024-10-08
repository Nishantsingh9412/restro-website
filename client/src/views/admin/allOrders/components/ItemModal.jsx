import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";

import { AddOrderItemAction } from "../../../../redux/action/OrderItems";
import { set } from "date-fns";

const ItemModal = (props) => {
  const initialState = {
    itemName: "",
    priceVal: "",
    priceUnit: "",
    description: "",
    isFavourite: "",
  };
  const { onOpen, isOpen, onClose, onSubmitData, isDrink } = props;

  const dispatch = useDispatch();

  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const localUserId = JSON.parse(localStorage.getItem("ProfileData"));
  const userId = localUserId?.result?._id;

  const autoFillform = () => {
    if (isDrink) {
      setFormState({
        itemName: "Coke",
        priceVal: 2,
        priceUnit: "Euro",
        description: "This is coke",
        isFavourite: true,
        pic: formState.pic,
      });
    } else {
      const itemNames = [
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
        itemName: itemNames[Math.floor(Math.random() * itemNames.length)],
        priceVal: priceVals[Math.floor(Math.random() * priceVals.length)],
        priceUnit: "Euro",
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        isFavourite: true,
        pic: formState.pic,
      });
    }
  };

  const handleClose = () => {
    onClose();
    setFormState(initialState);
  };

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

  //   const handleSubmitDrinks = (e) => {
  //     e.preventDefault();
  //     const drinksData = {
  //       orderName: formState.itemName,
  //       priceVal: formState.priceVal,
  //       priceUnit: formState.priceUnit,
  //       description: formState.description,
  //       isFavorite: formState.isFavourite,
  //       pic: formState.pic,
  //       isDrink: true,
  //       created_by: userId,
  //     };

  //     const AddItemPromise = dispatch(AddOrderItemAction(drinksData)).then(
  //       (res) => {
  //         if (res.success) {
  //           handleClose();
  //           return res.message;
  //         } else {
  //           throw new Error(res.message); // Make sure to throw an error here
  //         }
  //       }
  //     );
  //     toast.promise(AddItemPromise, {
  //       pending: "Processing Addition of Drink...",
  //       success: "Drink Added Successfully",
  //       error: (err) => err.message,
  //     });
  //   };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    formState.isDrink = isDrink;
    e.preventDefault();
    onSubmitData(formState);
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
                <FormControl id="itemName" isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    type="text"
                    name="itemName"
                    onChange={handleChange}
                    value={formState.itemName}
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
                  />
                </FormControl>

                <FormControl id="priceUnit">
                  <FormLabel>Price Unit</FormLabel>
                  <Select
                    name="priceUnit"
                    onChange={handleChange}
                    value={formState.priceUnit}
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

                <Button
                  mt="4"
                  colorScheme="blue"
                  type="submit"
                  isLoading={loading}
                >
                  Add Item
                </Button>
              </form>
            </Box>
          </ModalBody>
          {/* <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemModal;
