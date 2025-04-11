import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useToast } from "../../../../contexts/useToast";

const AddEditItemModal = (props) => {
  const initialState = {
    itemId: null,
    itemName: "",
    category: "",
    pic: "",
    basePrice: "",
    priceUnit: "",
    prepTime: "",
    description: "",
    inStock: false,
    isFavourite: false,
  };

  const showToast = useToast();
  const { isOpen, onClose, onSubmit, itemData } = props;
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(initialState);
  const [customization, setCustomization] = useState([]);

  const handleAddCustomization = () => {
    setCustomization([
      ...customization,
      {
        title: "",
        required: false,
        maxSelect: 1,
        option: [{ name: "", price: "" }],
      },
    ]);
  };

  const handleAddOption = (groupIndex) => {
    const updatedCustomization = [...customization];
    updatedCustomization[groupIndex].option.push({ name: "", price: "" });
    setCustomization(updatedCustomization);
  };

  const handleOptionChange = (groupIndex, optionIndex, field, value) => {
    const updatedCustomization = [...customization];
    updatedCustomization[groupIndex].option[optionIndex][field] = value;
    setCustomization(updatedCustomization);
  };

  const handleGroupChange = (groupIndex, field, value) => {
    const updatedCustomization = [...customization];
    updatedCustomization[groupIndex][field] = value;
    setCustomization(updatedCustomization);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    onClose();
    setItem(initialState);
    setCustomization([]);
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
        setItem((prevState) => ({
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

  useEffect(() => {
    if (itemData) {
      setItem({
        ...itemData,
      });
      setCustomization(itemData.customization || []);
    }
  }, [itemData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...item,
      customization,
    };
    onSubmit(payload);
    handleClose();
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>Add Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={1}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={1}>
                <FormControl id="itemId" isRequired>
                  <FormLabel>Item ID</FormLabel>
                  <Input
                    type="text"
                    name="itemId"
                    onChange={handleChange}
                    placeholder="Item ID"
                    value={item.itemId}
                    required
                  />
                </FormControl>
                <FormControl id="itemName" isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    type="text"
                    name="itemName"
                    placeholder="Item Name"
                    value={item.itemName}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl id="category" isRequired>
                  <FormLabel>Item Category</FormLabel>
                  <Input
                    type="text"
                    name="category"
                    value={item.category}
                    onChange={handleChange}
                    placeholder="Item Category"
                    required
                  />
                </FormControl>
                <Flex gap={2}>
                  <FormControl id="basePrice" isRequired>
                    <FormLabel>Base Price</FormLabel>
                    <NumberInput
                      value={item.basePrice}
                      onChange={(valueString) =>
                        handleChange({
                          target: { name: "basePrice", value: valueString },
                        })
                      }
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      precision={2}
                      required
                    >
                      <NumberInputField name="basePrice" />
                    </NumberInput>
                  </FormControl>
                  <FormControl id="priceUnit" isRequired>
                    <FormLabel>Price Unit</FormLabel>
                    <Select
                      name="priceUnit"
                      onChange={handleChange}
                      value={item.priceUnit}
                      required
                    >
                      <option value="">Select Price Unit</option>
                      <option value="Euro">Euro</option>
                    </Select>
                  </FormControl>
                </Flex>
                <FormControl id="pic" mt={1}>
                  <FormLabel>Upload Picture</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => postOrderImage(e.target.files[0])}
                  />
                </FormControl>
                <Text>{item.pic}</Text>
                <FormControl id="prepTime" isRequired>
                  <FormLabel>Preparation Time</FormLabel>
                  <Input
                    type="text"
                    name="prepTime"
                    value={item.prepTime}
                    onChange={handleChange}
                    placeholder="Preparation Time (in minutes)"
                    required
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={item.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={3}
                    resize="vertical"
                  />
                </FormControl>

                {customization.map((group, groupIndex) => (
                  <Box
                    key={groupIndex}
                    borderWidth="1px"
                    p={4}
                    borderRadius="md"
                    mt={2}
                  >
                    <Flex gap={2}>
                      <FormControl
                        id={`customizationGroup${groupIndex}`}
                        isRequired
                      >
                        <FormLabel>Group Title</FormLabel>
                        <Input
                          type="text"
                          value={group.title}
                          onChange={(e) =>
                            handleGroupChange(
                              groupIndex,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Enter Title"
                          required
                        />
                      </FormControl>
                      <FormControl id="maxSelect" isRequired>
                        <FormLabel>Max Select</FormLabel>
                        <NumberInput
                          value={group.maxSelect}
                          onChange={(valueString) =>
                            handleGroupChange(
                              groupIndex,
                              "maxSelect",
                              valueString
                            )
                          }
                          min={1}
                          required
                        >
                          <NumberInputField name="basePrice" />
                        </NumberInput>
                      </FormControl>
                    </Flex>
                    <FormControl
                      id={`customizationRequired${groupIndex}`}
                      mt={2}
                      display="flex"
                      alignItems="center"
                    >
                      <FormLabel mb={0}>Required</FormLabel>
                      <Switch
                        isChecked={group.required}
                        onChange={(e) =>
                          handleGroupChange(
                            groupIndex,
                            "required",
                            e.target.checked
                          )
                        }
                        colorScheme="teal"
                      />
                    </FormControl>
                    {group.option.map((opt, optionIndex) => (
                      <Box key={optionIndex} display={"flex"} gap={2} mt={1}>
                        <FormControl id="optionName" isRequired>
                          <FormLabel>Option Name</FormLabel>
                          <Input
                            type="text"
                            value={opt.name}
                            onChange={(e) =>
                              handleOptionChange(
                                groupIndex,
                                optionIndex,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Option Name"
                            required
                          />
                        </FormControl>
                        <FormControl id="optionPrice" isRequired>
                          <FormLabel>Option Price</FormLabel>
                          <NumberInput
                            value={opt.price}
                            onChange={(valueString) =>
                              handleOptionChange(
                                groupIndex,
                                optionIndex,
                                "price",
                                valueString
                              )
                            }
                            min={0}
                            step={0.01}
                            precision={2}
                            placeholder="0.00"
                            required
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      </Box>
                    ))}
                    <Button
                      mt={4}
                      colorScheme="green"
                      onClick={() => handleAddOption(groupIndex)}
                    >
                      Add Option
                    </Button>
                  </Box>
                ))}
                <Button
                  colorScheme="blue"
                  onClick={handleAddCustomization}
                  mt={2}
                  width={"50%"}
                  alignSelf={"end"}
                >
                  Add Customization
                </Button>
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
                      isChecked={item.isFavourite}
                      onChange={() => {
                        setItem((prevState) => ({
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
                      isChecked={item.inStock}
                      onChange={() => {
                        setItem((prev) => ({
                          ...prev,
                          inStock: !prev.inStock,
                        }));
                      }}
                    />
                  </FormControl>
                </Flex>
                <Button
                  mt={4}
                  colorScheme="teal"
                  type="submit"
                  width="full"
                  isLoading={loading}
                >
                  {itemData ? "Update Item" : "Add Item"}
                </Button>
              </Stack>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddEditItemModal;

AddEditItemModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  itemData: PropTypes.object,
};
