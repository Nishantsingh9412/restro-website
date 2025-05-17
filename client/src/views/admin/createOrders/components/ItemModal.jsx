import { useState } from "react";

import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Stack,
  Image,
  Text,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useToast } from "../../../../contexts/useToast";

const ShowItemModal = ({ item, isOpen, onClose, handleAddToCart }) => {
  const showToast = useToast();
  const [customizationSelections, setCustomizationSelections] = useState({});

  const handleOptionChange = (customizationId, value) => {
    setCustomizationSelections((prev) => ({
      ...prev,
      [customizationId]: value,
    }));
  };

  const onAddToCart = () => {
    const hasAllRequired = item.customization.every((c) => {
      if (!c.required) return true;
      const selected = customizationSelections[c._id] || [];
      return selected.length > 0 && selected.length <= c.maxSelect;
    });

    if (!hasAllRequired) {
      showToast(
        "Please complete all required customizations and adhere to selection limits.",
        "error"
      );
      return;
    }

    // Build the selectedCustomizations array
    const selectedCustomizations = item.customization.map((custom) => {
      const selectedNames = customizationSelections[custom._id] || [];

      const selectedOptions = custom.option
        .filter((opt) => selectedNames.includes(opt.name))
        .map((opt) => ({
          name: opt.name,
          price: opt.price,
        }));

      return {
        title: custom.title,
        selectedOptions,
      };
    });
    // Calculate price with customisations
    const price =
      item.basePrice +
      selectedCustomizations.reduce((acc, custom) => {
        return (
          acc + custom.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
        );
      }, 0);

    const finalOrder = {
      ...item,
      selectedCustomizations,
      price,
      totalPrice: price,
      totalQuantity: 1,
    };
    handleAddToCart(finalOrder);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent borderRadius="lg" overflow="hidden">
        <ModalHeader
          bg="blue.400"
          color="white"
          fontSize="lg"
          fontWeight="bold"
        >
          {item.itemName}
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody p={6}>
          <Box mb={4}>
            <Image
              src={item.pic}
              alt={item.itemName}
              borderRadius="md"
              boxShadow="md"
              objectFit="cover"
              w="100%"
              h="200px"
            />
          </Box>
          {/* Description */}
          <Text fontWeight="bold">
            Description: <span>📖</span>
          </Text>
          <Text mb={2} fontSize="md" color="gray.500">
            {item.description || "No description available."}
          </Text>

          {/* Display Ingredients */}
          <Text fontWeight="bold">
            Ingredients: <span>🍴</span>
          </Text>
          <Text fontSize="md" color="gray.500" mb={4}>
            {item.ingredients?.length > 0
              ? item.ingredients.join(", ")
              : "No ingredients listed."}
          </Text>

          {item.customization.map((custom) => (
            <Box key={custom._id} mb={6}>
              <Text fontWeight="bold" fontSize="md" mb={2}>
                {custom.title}{" "}
                {custom.required && (
                  <Text as="span" color="red.500">
                    *
                  </Text>
                )}
                <Text as="span" color="gray.500" fontSize="sm">
                  {" "}
                  (Max: {custom.maxSelect})<span> ⚙️ </span>
                </Text>
              </Text>
              <Divider mb={2} />

              {custom.maxSelect === 1 ? (
                <RadioGroup
                  onChange={(val) => handleOptionChange(custom._id, [val])}
                  value={customizationSelections[custom._id]?.[0] || ""}
                >
                  <Stack direction="column" spacing={2}>
                    {custom.option.map((opt) => (
                      <Radio key={opt._id} value={opt.name}>
                        {opt.name}{" "}
                        <Text as="span" color="gray.500" fontSize="sm">
                          (+{opt.price}€)
                        </Text>
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              ) : (
                <CheckboxGroup
                  onChange={(vals) => handleOptionChange(custom._id, vals)}
                  value={customizationSelections[custom._id] || []}
                >
                  <Stack direction="column" spacing={2}>
                    {custom.option.map((opt) => (
                      <Checkbox key={opt._id} value={opt.name}>
                        {opt.name}{" "}
                        <Text as="span" color="gray.500" fontSize="sm">
                          (+{opt.price}€)
                        </Text>
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              )}
              {customizationSelections[custom._id]?.length >
                custom.maxSelect && (
                <Text color="red.500" fontSize="sm">
                  You can select up to {custom.maxSelect} options.
                </Text>
              )}
            </Box>
          ))}
        </ModalBody>

        <ModalFooter bg="gray.50">
          <Button colorScheme="blue" onClick={onAddToCart} mr={3}>
            Add to Cart
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ShowItemModal.propTypes = {
  item: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    basePrice: PropTypes.number.isRequired,
    pic: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    customization: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        required: PropTypes.bool.isRequired,
        maxSelect: PropTypes.number.isRequired,
        option: PropTypes.arrayOf(
          PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
};

export default ShowItemModal;
