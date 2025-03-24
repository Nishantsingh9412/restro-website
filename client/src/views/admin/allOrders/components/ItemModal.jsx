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
    isFavourite: "",
  };

  const showToast = useToast();
  const { isOpen, onClose, onSubmitData, isDrink, data } = props;
  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subItemInput, setSubItemInput] = useState("");

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
        isFavourite: data?.isFavourite || false,
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

  const handleSubItemKeyPress = (e) => {
    if (e.key !== "Enter" || !subItemInput.trim()) return;

    e.preventDefault();
    const subItemData = subItemInput.trim().split(" ");
    const subItemName = subItemData.slice(0, -1).join(" ");
    const subItemPrice = parseFloat(subItemData[subItemData.length - 1]);

    if (!subItemName || isNaN(subItemPrice)) {
      showToast("Enter a valid sub-item name followed by its price", "error");
      return;
    }

    if (formState.subItems.some((item) => item.name === subItemName)) {
      showToast("Sub-item already exists", "error");
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      subItems: [
        ...prevState.subItems,
        { name: subItemName, price: subItemPrice },
      ],
    }));
    setSubItemInput("");
  };

  const removeSubItem = (index) => {
    setFormState((prevState) => ({
      ...prevState,
      subItems: prevState.subItems.filter((_, i) => i !== index),
    }));
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
            maxW="sm"
            m="auto"
            p="4"
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
                <FormLabel>
                  Sub Items{" "}
                  <span style={{ fontWeight: "lighter", fontSize: "14px" }}>
                    (Eg: XYZ 3.5)
                  </span>
                </FormLabel>
                <Flex
                  flexWrap="wrap"
                  gap="2"
                  px="1"
                  borderWidth="1px"
                  borderRadius="md"
                  alignItems="center"
                >
                  {formState.subItems.map((item, index) => (
                    <Tag
                      key={index}
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                      height="25px"
                    >
                      {/* {console.log(item)} */}
                      <TagLabel>{item["name"]}</TagLabel>
                      <TagLabel>{`: ${item["price"]}`}</TagLabel>
                      <TagCloseButton onClick={() => removeSubItem(index)} />
                    </Tag>
                  ))}
                  <Input
                    p={0}
                    m={0}
                    pl={1}
                    type="text"
                    placeholder={
                      formState.subItems.length === 0
                        ? "Enter a valid sub-item name followed by its price"
                        : ""
                    }
                    value={subItemInput}
                    onChange={(e) => setSubItemInput(e.target.value)}
                    onKeyDown={handleSubItemKeyPress}
                    border="none"
                    outline="none"
                    _focusVisible={{ outline: "none" }}
                    flex="1"
                  />
                </Flex>
              </FormControl>

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

              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Textarea
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
                  <option value="">Select Favourite</option>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </Select>
              </FormControl>

              <Button
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
