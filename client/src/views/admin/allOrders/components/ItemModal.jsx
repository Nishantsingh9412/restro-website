import { useEffect, useState } from "react";
import { useToast } from "../../../../contexts/useToast";
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
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  Text,
  Switch,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
const ItemModal = (props) => {
  const initialState = {
    itemId: "",
    orderName: "",
    category: "",
    subItems: [],
    priceVal: "",
    priceUnit: "",
    description: "",
    preparationTime: "",
    isFavourite: "",
    inStock: "",
  };

  const showToast = useToast();
  const { isOpen, onClose, onSubmitData, isDrink, data } = props;
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subItemName, setSubItemName] = useState("");
  const [subItemPrice, setSubItemPrice] = useState("");

  useEffect(() => {
    if (data) {
      setFormState((prevState) => ({
        ...prevState,
        itemId: data?.itemId || "",
        orderName: data?.orderName || "",
        category: data?.category || "",
        subItems: data?.subItems || [],
        priceVal: data?.priceVal || "",
        priceUnit: data?.priceUnit || "",
        description: data?.description || "",
        preparationTime: data?.preparationTime || "",
        isFavourite: data?.isFavourite || false,
        inStock: data?.inStock || false,
        pic: data.pic,
        created_by: data.created_by,
      }));
    }
    return () => setFormState(initialState);
  }, [data]);

  const handleClose = () => {
    onClose();
    setFormState(initialState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "priceVal" && !/^\d*\.?\d*$/.test(value)) {
      showToast("Price value should be a valid number", "error");
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddSubItem = () => {
    if (!subItemName.trim() || !subItemPrice.trim()) {
      showToast("Enter a valid sub-item name and price", "error");
      return;
    }

    const price = parseFloat(subItemPrice);
    if (isNaN(price)) {
      showToast("Sub-item price must be a number", "error");
      return;
    }

    if (formState.subItems.some((item) => item.name === subItemName)) {
      showToast("Sub-item already exists", "error");
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      subItems: [...prevState.subItems, { name: subItemName, price }],
    }));
    setSubItemName("");
    setSubItemPrice("");
  };

  const removeSubItem = (index) => {
    setFormState((prevState) => ({
      ...prevState,
      subItems: prevState.subItems.filter((_, i) => i !== index),
    }));
  };

  // Function to handle image upload
  const postOrderImage = async (pics) => {
    setLoading(true);
    if (pics === undefined) {
      showToast("Please upload a picture", "error");
      setLoading(false);
      return;
    }
    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      showToast("Invalid image format", "error");
      setLoading(false);
      return;
    }
    if (pics.size > 2000000) {
      setLoading(false);
      return showToast("Image size should be less than 2 MB ", "error");
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
        setLoading(false);
        return showToast(err.message, "error");
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (
      formState.itemId === "" ||
      formState.orderName === "" ||
      formState.priceVal === "" ||
      formState.priceUnit === "" ||
      formState.category === ""
    ) {
      showToast("Please fill all the required fields", "error");
      return;
    }
    if (formState.isFavourite === "") {
      formState.isFavourite = "false";
    }

    formState.isDrink = isDrink;
    onSubmitData(formState);
    handleClose();
    setLoading(false);
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>Add Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            maxW="md"
            m="auto"
            p="2"
            borderWidth="1px"
            borderRadius="lg"
            background={"whiteAlpha.100"}
          >
            <form onSubmit={handleSubmit}>
              <FormControl id="itemId" isRequired>
                <FormLabel>Item ID</FormLabel>
                <Input
                  type="text"
                  name="itemId"
                  onChange={handleChange}
                  placeholder="Item ID"
                  value={formState.itemId}
                  required
                />
              </FormControl>
              <FormControl mt={1} id="orderName" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="orderName"
                  onChange={handleChange}
                  placeholder="Item Name"
                  value={formState.orderName}
                  required
                />
              </FormControl>
              <FormControl mt={1} id="category" isRequired>
                <FormLabel>Category</FormLabel>
                <Input
                  type="text"
                  name="category"
                  onChange={handleChange}
                  placeholder="Item Category"
                  value={formState.category}
                  required
                />
              </FormControl>
              {/* Sub Items (Tags inside Input) */}
              <FormControl mt={1} id="subItems">
                <FormLabel>Sub Items</FormLabel>
                <Flex gap={2}>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={subItemName}
                    onChange={(e) => setSubItemName(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={subItemPrice}
                    onChange={(e) => setSubItemPrice(e.target.value)}
                  />
                  <Button onClick={handleAddSubItem} colorScheme="blue" px={6}>
                    Add
                  </Button>
                </Flex>
              </FormControl>
              <Flex flexWrap="wrap" mt={2} gap={2}>
                {formState.subItems.map((item, index) => (
                  <Tag
                    key={index}
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                  >
                    <TagLabel>
                      {item.name}: {item.price}
                    </TagLabel>
                    <TagCloseButton onClick={() => removeSubItem(index)} />
                  </Tag>
                ))}
              </Flex>
              <FormControl id="pic" mt={1}>
                <FormLabel>Upload Picture</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => postOrderImage(e.target.files[0])}
                />
              </FormControl>
              <Text>{formState.pic}</Text>
              <Flex gap={2}>
                <FormControl mt={1} id="priceVal" isRequired>
                  <FormLabel>Price Value</FormLabel>
                  <Input
                    type="number"
                    name="priceVal"
                    placeholder="0.00"
                    onChange={handleChange}
                    step="0.01"
                    min={0}
                    value={formState.priceVal}
                    required
                  />
                </FormControl>

                <FormControl mt={1} id="priceUnit" isRequired>
                  <FormLabel>Price Unit</FormLabel>
                  <Select
                    name="priceUnit"
                    onChange={handleChange}
                    value={formState.priceUnit}
                    required
                  >
                    <option value="">Select Price Unit</option>
                    <option value="Euro">Euro</option>
                  </Select>
                </FormControl>
              </Flex>
              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  onChange={handleChange}
                  value={formState.description}
                />
              </FormControl>
              <FormControl id="preparationTime" mt={1}>
                <FormLabel>Preparation Time</FormLabel>
                <Input
                  type="number"
                  name="preparationTime"
                  onChange={handleChange}
                  placeholder="Prep Time (mins)"
                  value={formState.preparationTime}
                  required
                />
              </FormControl>
              <Flex>
                <FormControl
                  width={"55%"}
                  mt={4}
                  display="flex"
                  alignItems="center"
                  id="isFavourite"
                >
                  <FormLabel mb="0">Favourite</FormLabel>
                  <Switch
                    isChecked={formState.isFavourite}
                    onChange={() => {
                      setFormState((prevState) => ({
                        ...prevState,
                        isFavourite: !prevState.isFavourite,
                      }));
                    }}
                  />
                </FormControl>{" "}
                <FormControl
                  mt={4}
                  display="flex"
                  alignItems="center"
                  id="inStock"
                >
                  <FormLabel mb="0">In-Stock</FormLabel>
                  <Switch
                    isChecked={formState.inStock}
                    onChange={() => {
                      setFormState((prev) => ({
                        ...prev,
                        inStock: !prev.inStock,
                      }));
                    }}
                  />
                </FormControl>
              </Flex>
              <Button
                width={"100%"}
                mt="4"
                colorScheme="blue"
                type="submit"
                isLoading={loading}
              >
                {data ? "Update Item" : "Add Item"}
              </Button>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ItemModal;

ItemModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitData: PropTypes.func.isRequired,
  isDrink: PropTypes.bool.isRequired,
  data: PropTypes.object,
};
