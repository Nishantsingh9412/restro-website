/* eslint-disable react/prop-types */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Grid,
  GridItem,
  Input,
  Select,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ItemManagementModal({
  isOpen,
  onClose,
  actionType,
  itemData,
  handleSubmit,
}) {
  const initialItemState = {
    item_name: "",
    item_unit: "",
    available_quantity: 0,
    minimum_quantity: 0,
    bar_code: "",
    existing_barcode_no: "",
    expiry_date: "",
    created_by: "",
    //   usage_rate_value: "",
    //   usage_rate_unit: "",
    //   Last_Replenished: "",
  };
  const [formData, setFormData] = useState(initialItemState);

  console.log("itemData", itemData);

  // Populate form for edit mode
  useEffect(() => {
    if (actionType !== "add" && itemData) {
      const {
        item_name,
        item_unit,
        available_quantity,
        minimum_quantity,
        bar_code,
        existing_barcode_no,
        expiry_date,
      } = itemData;
      setFormData(() => ({
        item_name: item_name || "",
        item_unit: item_unit,
        available_quantity: available_quantity || 0,
        minimum_quantity: minimum_quantity || 0,
        bar_code: bar_code || "",
        existing_barcode_no: existing_barcode_no || "",
        expiry_date: expiry_date?.split("T")[0] || "",
      }));
    } else {
      //Add barcode value if exists
      setFormData((prev) => ({ ...prev, bar_code: itemData?.bar_code || "" }));
    }
  }, [actionType, itemData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Autofill default values for new items
  const autofillDefaults = () => {
    if (actionType === "add") {
      setFormData((prev) => ({
        ...prev,
        item_name: "New Item",
        item_unit: "Piece",
        available_quantity: 10,
        minimum_quantity: 100,
        bar_code: nanoid(13),
        expiry_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
          .toISOString()
          .split("T")[0],
      }));
    }
  };

  // Validate required fields
  const validate = () => {
    if (
      !formData.item_name ||
      !formData.item_unit ||
      formData.available_quantity <= 0 ||
      formData.minimum_quantity <= 0 ||
      !formData.bar_code
    ) {
      toast.error("All required fields must be filled out");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSave = () => {
    //The nanoid() function generate a unique id for the barcode
    if (actionType === "add" && !formData.bar_code) {
      formData.bar_code = nanoid(13);
    }

    //if required field is empty it'll return;
    if (!validate()) return;

    handleSubmit(formData);
    handleClose();
  };

  // Handle modal close action
  const handleClose = () => {
    setFormData(initialItemState);
    onClose();
  };

  // Render input fields dynamically
  const renderInput = (
    label,
    name,
    type = "text",
    isSelect = false,
    options = [],
    isRequired = false
  ) => (
    <>
      {label} {isRequired && <span style={{ color: "red" }}>*</span>}
      {isSelect ? (
        <Select
          name={name}
          placeholder="Select option"
          mb={4}
          onChange={handleInputChange}
          value={formData[name] || ""}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          name={name}
          type={type}
          mb={4}
          onChange={handleInputChange}
          value={formData[name] || ""}
        />
      )}
    </>
  );

  // Modal structure
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {actionType === "edit" ? "Edit Item" : "Add New Item"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={12}>
              {renderInput("Item Name", "item_name", "text", false, [], true)}
              {renderInput(
                "Item Unit",
                "item_unit",
                "text",
                true,
                ["Grams", "KG", "Litre", "Piece", "Gallon", "Dozen"],
                true
              )}
              {renderInput(
                "Available Quantity",
                "available_quantity",
                "number",
                false,
                [],
                true
              )}
              {renderInput(
                "Minimum Quantity",
                "minimum_quantity",
                "number",
                false,
                [],
                true
              )}
              {renderInput("Expiry Date", "expiry_date", "date")}
              {renderInput("Existing Barcode No", "bar_code")}
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={autofillDefaults}>
            Fill
          </Button>
          <Button colorScheme="blue" mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="ghost"
            backgroundColor="rgb(33, 180, 152)"
            color="white"
            onClick={handleSave}
          >
            {actionType === "edit" ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
