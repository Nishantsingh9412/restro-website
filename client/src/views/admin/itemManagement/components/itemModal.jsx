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
import { useToast } from "../../../../contexts/useToast";
import { actionTypes } from "../../../../utils/constant";

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
    purchase_price: 0,
    supplier_name: "",
    supplier_contact: "",
    tags: "",
    notes: "",
  };
  const [formData, setFormData] = useState(initialItemState);
  const showToast = useToast();

  useEffect(() => {
    if (actionType !== actionTypes.ADD && itemData) {
      const {
        item_name,
        item_unit,
        available_quantity,
        minimum_quantity,
        bar_code,
        existing_barcode_no,
        expiry_date,
        purchase_price,
        supplier_name,
        supplier_contact,
        tags,
        notes,
      } = itemData;
      setFormData(() => ({
        item_name: item_name || "",
        item_unit: item_unit,
        available_quantity: available_quantity || 0,
        minimum_quantity: minimum_quantity || 0,
        bar_code: bar_code || "",
        existing_barcode_no: existing_barcode_no || "",
        expiry_date: expiry_date?.split("T")[0] || "",
        purchase_price: purchase_price || 0,
        supplier_name: supplier_name || "",
        supplier_contact: supplier_contact || "",
        tags: tags || "",
        notes: notes || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, bar_code: itemData?.bar_code || "" }));
    }
  }, [actionType, itemData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const autofillDefaults = () => {
    if (actionType === actionTypes.ADD) {
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
        purchase_price: 0,
        supplier_name: "Default Supplier",
        supplier_contact: "1234567890",
        tags: "default",
        notes: "Default notes",
      }));
    }
  };

  const validate = () => {
    if (
      !formData.item_name ||
      !formData.item_unit ||
      formData.available_quantity <= 0 ||
      formData.minimum_quantity <= 0 ||
      !formData.bar_code
    ) {
      showToast("All required fields must be filled out", "error");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (actionType === actionTypes.ADD && !formData.bar_code) {
      formData.bar_code = nanoid(13);
    }

    if (!validate()) return;

    handleSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData(initialItemState);
    onClose();
  };

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
              {renderInput("Category", "category", "text", false, [], true)}
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
              {renderInput(
                "Purchase Price",
                "purchase_price",
                "number",
                false,
                [],
                true
              )}
              {renderInput("Supplier Name", "supplier_name", "text")}
              {renderInput("Supplier Contact", "supplier_contact", "text")}
              {renderInput("Tags", "tags", "text")}
              {renderInput("Notes", "notes", "text")}
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
