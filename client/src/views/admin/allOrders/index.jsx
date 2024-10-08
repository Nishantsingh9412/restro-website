import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Select,
  InputLeftElement,
  InputGroup,
  List,
  InputRightElement,
  Badge,
} from "@chakra-ui/react";
import { BiSolidTrash } from "react-icons/bi";
import { IoMdSearch } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import {
  AddOrderItemAction,
  getAllOrderItemsAction,
  searchOrderItemAction,
  searchDrinksOnlyAction,
  getDrinksOnlyAction,
} from "../../../redux/action/OrderItems";
import CartDrawer from "./components/CartDrawer";
import ItemModal from "./components/ItemModal";

export default function AllOrders() {
  const OverlayOne = () => <ModalOverlay />;

  const {
    isOpen: isOpenItem,
    onOpen: onOpenItem,
    onClose: onCloseItem,
  } = useDisclosure();
  const {
    isOpen: isOpenCart,
    onOpen: onOpenCart,
    onClose: onCloseCart,
  } = useDisclosure();
  const {
    isOpen: isOpenDrinks,
    onOpen: onOpenDrinks,
    onClose: onCloseDrinks,
  } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItemLength, setSelectedItemLength] = useState(0);
  const [selectedItemTemp, setSelectedItemTemp] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ItemName, setItemName] = useState("");
  const [priceVal, setPriceVal] = useState(0);
  const [priceUnit, setPriceUnit] = useState("");
  const [pic, setPic] = useState(undefined);
  const [description, setDescription] = useState("");
  const [allOrderTotal, setAllOrderTotal] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [allItemsData, setAllItemsData] = useState([]);
  const [drinksSearchPerformed, setDrinksSearchPerformed] = useState(false);
  const [searchTermDrinks, setSearchTermDrinks] = useState("");
  const [searchResultsDrinks, setSearchResultsDrinks] = useState([]);
  const [drinksData, setDrinksData] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = JSON.parse(localStorage.getItem("ProfileData"))?.result?._id;

  const handleSearchDrinks = () => {
    dispatch(searchDrinksOnlyAction(searchTermDrinks, userId)).then((res) => {
      if (res.success) {
        setSearchResultsDrinks(res?.data);
        console.log("Search Results: ", res?.data);
      } else {
        console.log("error from searchDrinksOnlyAction: " + res.message);
      }
    });
  };

  const handleProcessOrder = () => {
    navigate("/admin/process-order", { selectedItemTemp, allOrderTotal });
  };

  const postOrderImage = (pics) => {
    if (!pics) {
      toast.error("Please upload a picture");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(pics.type)) {
      toast.error("Invalid image format");
      return;
    }

    if (pics.size > 2000000) {
      return toast.error("Image size should be less than 2 MB");
    }

    setLoading(true);
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
        setPic(data.url.toString());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Error Uploading Image to server");
      });
  };

  const handleSubmitItemOrder = (data) => {
    // e.preventDefault();

    const AddItemPromise = dispatch(AddOrderItemAction(data)).then((res) => {
      if (res.success) {
        onClose();
        dispatch(getAllOrderItemsAction(userId)).then((res) => {
          if (res.success) {
            setAllItemsData(res?.data);
          } else {
            console.log("Error Getting Data");
          }
        });
        return res.message;
      } else {
        throw new Error(res.message);
      }
    });
    toast.promise(AddItemPromise, {
      pending: "Processing Addition of Item...",
      success: "Item Added Successfully",
      error: (err) => err.message,
    });
  };

  const AllOrderItemsReducer = useSelector((state) => state.OrderItemReducer);
  const AllOrderItemsLength = AllOrderItemsReducer?.length;

  const handleRemoveItemOrder = (id) => {
    if (id) {
      const item = selectedItemTemp.find((item) => item._id === id);
      setAllOrderTotal(allOrderTotal - item.priceVal);
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP", data: id });
    }
  };

  const handleRemoveItemOrderCompletely = (id) => {
    if (id) {
      const item = selectedItemTemp.find((item) => item._id === id);
      setAllOrderTotal(allOrderTotal - item.priceVal * item.quantity);
      dispatch({ type: "REMOVE_ORDER_ITEM_TEMP_COMPLETELY", data: id });
    }
  };

  const handleAddItemOrder = (product) => {
    if (product) {
      setAllOrderTotal(allOrderTotal + product.priceVal);
      dispatch({ type: "ADD_ORDER_ITEM_TEMP", data: product });
    }
  };

  const handleSearch = () => {
    dispatch(searchOrderItemAction(searchTerm, userId)).then((res) => {
      if (res.success) {
        setSearchResults(res?.data);
        console.log("Search Results: ", res?.data);
      } else {
        console.log("error from searchOrderItemAction: " + res.message);
      }
    });
  };

  useEffect(() => {
    setSelectedItemTemp(AllOrderItemsReducer.items);
  }, [handleAddItemOrder]);

  useEffect(() => {
    dispatch(getAllOrderItemsAction(userId)).then((res) => {
      if (res.success) {
        setAllItemsData(res?.data);
      } else {
        console.log("Error Getting Data");
      }
    });
  }, []);

  useEffect(() => {
    dispatch(getDrinksOnlyAction(userId)).then((res) => {
      if (res.success) {
        setDrinksData(res?.data);
      } else {
        console.log("Error Getting Drinks Data");
      }
    });
  }, []);

  return (
    <div
      style={{ marginTop: "4vw", padding: "2rem", backgroundColor: "#f7f7f7" }}
    >
      <ToastContainer />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="2rem"
      >
        <Button
          leftIcon={<FiPlusCircle />}
          colorScheme="teal"
          variant="solid"
          onClick={onOpenItem}
        >
          Add Items
        </Button>

        <Box position="relative" display="inline-block">
          <Button
            leftIcon={<FaCartShopping />}
            colorScheme="teal"
            variant="solid"
            onClick={onOpenCart}
          >
            Cart
          </Button>
          <Badge
            colorScheme="teal"
            variant="solid"
            position="absolute"
            top="-2"
            right="-2"
            borderRadius="full"
          >
            {AllOrderItemsLength}
          </Badge>
        </Box>

        <Button
          leftIcon={<FiPlusCircle />}
          colorScheme="teal"
          variant="solid"
          onClick={onOpenDrinks}
        >
          Add Drinks
        </Button>
      </Box>

      {/* <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Add Items</ModalHeader>
          <Button onClick={autoFillform}>Auto Fill</Button>
          <ModalCloseButton />
          <ModalBody>
            <Box
              maxW="sm"
              m="auto"
              p="4"
              borderWidth="1px"
              borderRadius="lg"
              background={"white"}
            >
              <form onSubmit={handleSubmitItemOrder}>
                <FormControl id="ItemName" isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => setItemName(e.target.value)}
                    value={ItemName}
                  />
                </FormControl>

                <FormControl id="priceVal" isRequired>
                  <FormLabel>Price Value</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => setPriceVal(e.target.value)}
                    min={0}
                    value={priceVal}
                  />
                </FormControl>

                <FormControl id="priceUnit">
                  <FormLabel>Price Unit</FormLabel>
                  <Select
                    onChange={(e) => setPriceUnit(e.target.value)}
                    value={priceUnit}
                  >
                    <option value=""> Select Price Unit </option>
                    <option value="Euro">Euro</option>
                  </Select>
                </FormControl>

                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                </FormControl>

                <FormControl id="isFavourite">
                  <FormLabel>Favourite</FormLabel>
                  <Select
                    onChange={(e) => setIsFavourite(e.target.value)}
                    value={isFavourite}
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
                  colorScheme="teal"
                  type="submit"
                  isLoading={loading}
                >
                  Add Item
                </Button>
              </form>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

      <ItemModal
        isOpen={isOpenItem}
        onOpen={onOpenItem}
        onClose={onCloseItem}
        isDrink={false}
        handleSubmit={handleSubmitItemOrder}
      />

      <ItemModal
        isOpen={isOpenDrinks}
        onOpen={onOpenDrinks}
        onClose={onCloseDrinks}
        isDrink={true}
        handleSubmit={handleSubmitItemOrder}
      />

      <Box display={{ base: "block", md: "flex" }} gap="2rem">
        {[
          {
            data: allItemsData,
            searchTerm,
            setSearchTerm,
            searchPerformed,
            setSearchPerformed,
            searchResults,
            setSearchResults,
            handleSearch,
          },
          {
            data: drinksData,
            searchTerm: searchTermDrinks,
            setSearchTerm: setSearchTermDrinks,
            searchPerformed: drinksSearchPerformed,
            setSearchPerformed: setDrinksSearchPerformed,
            searchResults: searchResultsDrinks,
            setSearchResults: setSearchResultsDrinks,
            handleSearch: handleSearchDrinks,
          },
        ].map((section, index) => (
          <Box
            key={index}
            flexBasis={{ base: "100%", md: "50%" }}
            p={5}
            borderWidth={1}
            borderRadius="lg"
            background="white"
            boxShadow="md"
          >
            <InputGroup mb="1rem">
              <InputLeftElement pointerEvents={"none"}>
                <IoMdSearch size={"20"} aria-label="Search database" />
              </InputLeftElement>
              <InputRightElement>
                <MdCancel
                  size={"20"}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    section.setSearchPerformed(false);
                    section.setSearchTerm("");
                  }}
                />
              </InputRightElement>

              <Input
                paddingLeft={"2.5rem"}
                borderRadius={"50px"}
                placeholder="Search..."
                value={section.searchTerm}
                onChange={(e) => {
                  section.setSearchTerm(e.target.value);
                  section.setSearchPerformed(true);
                  if (e.target.value.trim() !== "") {
                    section.handleSearch();
                  } else {
                    section.setSearchResults([]);
                  }
                }}
              />
            </InputGroup>
            {section.searchPerformed ? (
              <List mt={2}>
                {section.searchResults?.map((result, index) => (
                  <Box
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    mb={3}
                    p="4"
                    background="white"
                    boxShadow="sm"
                  >
                    <Box display="flex" alignItems="center">
                      <Image
                        borderRadius="full"
                        boxSize="50px"
                        src={result?.pic}
                        alt="Food-Image"
                      />
                      <Box marginLeft={"1rem"}>
                        <Text
                          mt="1"
                          fontWeight="semibold"
                          as="h4"
                          lineHeight="tight"
                          isTruncated
                        >
                          {result?.orderName}
                        </Text>
                        <Text
                          mt="1"
                          fontWeight="semibold"
                          as="h4"
                          lineHeight="tight"
                          isTruncated
                        >
                          {result?.priceVal} {result?.priceUnit}
                        </Text>
                      </Box>
                    </Box>

                    <Box display={"flex"} justifyContent={"end"} mt="2">
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          handleAddItemOrder(result);
                        }}
                      >
                        Add To Cart
                      </Button>
                    </Box>
                  </Box>
                ))}
              </List>
            ) : (
              <Box
                marginTop={"1rem"}
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap={6}
              >
                {section.data?.map((result, index) => (
                  <Box
                    key={result._id}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    p="4"
                    borderWidth="1px"
                    borderRadius="lg"
                    background="white"
                    boxShadow="sm"
                  >
                    <Image
                      borderRadius="full"
                      boxSize="50px"
                      src={result?.pic}
                      alt="Food-Image"
                    />
                    <Box marginLeft="1rem" textAlign="center">
                      <Text
                        mt="1"
                        fontWeight="semibold"
                        as="h6"
                        lineHeight="tight"
                        isTruncated
                      >
                        {result?.orderName}
                      </Text>
                      <Button
                        mt="2"
                        colorScheme="teal"
                        onClick={() => {
                          handleAddItemOrder(result);
                        }}
                      >
                        Add To Cart
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <CartDrawer
        isOpen={isOpenCart}
        onOpen={onOpenCart}
        onClose={onCloseCart}
      />
    </div>
  );
}
