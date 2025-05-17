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
  Stack,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useToast } from "../../../../contexts/useToast";
import {
  formatToGermanCurrency,
  parseGermanCurrency,
} from "../../../../utils/utils";

const AddEditItemModal = (props) => {
  const initialState = {
    itemId: null,
    itemName: "",
    category: "",
    pic: "",
    basePrice: "",
    // priceUnit: "",
    prepTime: "",
    description: "",
    // inStock: false,
    ingredients: "",
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

  // Function to validate the form data
  const validate = () => {
    const requiredFields = ["itemId", "itemName", "category", "basePrice"];
    for (const field of requiredFields) {
      if (
        !item[field] ||
        (typeof item[field] === "string" && item[field].trim() === "")
      ) {
        showToast(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        return true;
      }
    }
    for (const group of customization) {
      if (group.option.length === 0) {
        showToast(
          "Please add at least one option to each customization group",
          "error"
        );
        return true;
      }
      for (const opt of group.option) {
        if (
          !opt.name ||
          (typeof opt.name === "string" && opt.name.trim() === "")
        ) {
          showToast(`Please enter option name for ${group.title}`, "error");
          return true;
        }
        if (
          !opt.price ||
          (typeof opt.price === "string" && opt.price.trim() === "")
        ) {
          showToast(`Please enter option price for ${group.title}`, "error");
          return true;
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert the base price into a number
    item.basePrice = parseGermanCurrency(item.basePrice);

    // Convert the price of each option into a number
    customization.forEach((group) => {
      group.option.forEach((opt) => {
        opt.price = parseGermanCurrency(opt.price);
      });
    });

    // Convert the ingredients string into an array
    item.ingredients = item.ingredients?.split(",").map((ing) => ing.trim());

    // Check if all required fields are filled
    if (validate()) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const payload = {
      ...item,
      customization,
    };
    onSubmit(payload);
    handleClose();
  };

  useEffect(() => {
    if (itemData) {
      // Set the item state with the provided itemData
      setItem({
        ...itemData,
        basePrice: itemData?.basePrice
          ? formatToGermanCurrency(itemData?.basePrice) // Format basePrice to German currency
          : "", // Default to an empty string if basePrice is not provided
        ingredients: itemData?.ingredients?.join(", ") || "", // Convert array to string
      });

      // Set the customization state with formatted prices
      setCustomization(
        Array.isArray(itemData?.customization) // Check if customization is an array
          ? itemData.customization.map((group) => ({
              ...group, // Spread the group properties
              option: group.option.map((opt) => ({
                ...opt, // Spread the option properties
                price: formatToGermanCurrency(opt.price), // Format the price to German currency
              })),
            }))
          : [] // Default to an empty array if customization is not provided
      );
    }
  }, [itemData]);

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
                    placeholder="e.g., 12345"
                    value={item.itemId}
                    required
                  />
                </FormControl>
                <FormControl id="itemName" isRequired>
                  <FormLabel>Item Name</FormLabel>
                  <Input
                    type="text"
                    name="itemName"
                    placeholder="e.g., Margherita Pizza"
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
                    placeholder="e.g., Pizza"
                    required
                  />
                </FormControl>
                <Flex gap={2}>
                  <FormControl id="basePrice" isRequired>
                    <FormLabel>Base Price</FormLabel>
                    <Input
                      type="text"
                      name="basePrice"
                      value={item.basePrice}
                      onChange={handleChange}
                      placeholder="e.g., 12,50 €"
                      required
                    />
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    onClick={handleAddCustomization}
                    mt={2}
                    width={"100%"}
                    alignSelf={"end"}
                  >
                    Add Customization
                  </Button>
                </Flex>
                {customization.map((group, groupIndex) => (
                  <Box
                    key={groupIndex}
                    borderWidth="1px"
                    p={4}
                    borderRadius="md"
                    mt={2}
                    position="relative"
                  >
                    <Button
                      p={0}
                      size="xs"
                      colorScheme="red"
                      borderRadius={"50%"}
                      position="absolute"
                      top="-1.5px"
                      right="-1.5px"
                      onClick={() =>
                        setCustomization((prev) =>
                          prev.filter((_, index) => index !== groupIndex)
                        )
                      }
                    >
                      ✕
                    </Button>
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
                          p
                          placeholder="e.g., Toppings"
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
                      <Box
                        key={optionIndex}
                        display={"flex"}
                        gap={1}
                        mt={2}
                        alignItems={"center"}
                      >
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
                            placeholder="e.g., Extra Cheese"
                            required
                          />
                        </FormControl>

                        <FormControl id="optionPrice" isRequired>
                          <FormLabel>Option Price</FormLabel>
                          <Input
                            type="text"
                            value={opt.price}
                            onChange={(e) =>
                              handleOptionChange(
                                groupIndex,
                                optionIndex,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 2,50 €"
                            required
                          />
                        </FormControl>
                        {customization[groupIndex].option.length > 1 && (
                          <Button
                            p={0}
                            size="xs"
                            borderRadius={"50%"}
                            colorScheme="red"
                            top="15px"
                            onClick={() => {
                              const updatedOptions = [...customization];
                              updatedOptions[groupIndex].option =
                                updatedOptions[groupIndex].option.filter(
                                  (_, index) => index !== optionIndex
                                );
                              setCustomization(updatedOptions);
                            }}
                          >
                            ✕
                          </Button>
                        )}
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
                <FormControl id="pic" mt={1}>
                  <FormLabel>Upload Picture</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => postOrderImage(e.target.files[0])}
                  />
                </FormControl>
                <Text>{item.pic}</Text>
                <Flex gap={2}>
                  <FormControl id="ingredients">
                    <FormLabel>Ingredients</FormLabel>
                    <Input
                      type="text"
                      name="ingredients"
                      value={item.ingredients}
                      onChange={handleChange}
                      placeholder="e.g., Cheese, Tomato, Basil"
                    />
                  </FormControl>
                  <FormControl id="prepTime" isRequired>
                    <FormLabel>Preparation Time</FormLabel>
                    <Input
                      type="text"
                      name="prepTime"
                      value={item.prepTime}
                      onChange={handleChange}
                      placeholder="e.g., 15 (in minutes)"
                      required
                    />
                  </FormControl>
                </Flex>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={item.description}
                    onChange={handleChange}
                    placeholder="e.g., A classic pizza with fresh mozzarella and basil."
                    rows={3}
                    resize="vertical"
                  />
                </FormControl>
                <FormControl
                  mt={2}
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
                </FormControl>
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
