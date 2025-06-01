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
  Input,
  Select,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useToast } from "../../../../contexts/useToast";
import PropTypes from "prop-types";
import {
  formatDateForInput,
  formatToGermanCurrency,
  parseGermanCurrency,
} from "../../../../utils/utils";

export default function ItemAddEditModal({
  isOpen,
  onClose,
  itemData,
  onSubmit,
  suppliers,
}) {
  const initialItemState = {
    itemName: "",
    category: "",
    itemUnit: "",
    availableQuantity: "",
    lowStockQuantity: "",
    barCode: "",
    expiryDate: "",
    purchasePrice: "",
    supplierName: "",
    supplierContact: "",
    notes: "",
    storedLocation: "",
  };

  const showToast = useToast();
  const [formData, setFormData] = useState(initialItemState);
  const isEdit = Boolean(itemData && itemData?._id);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) || "" : value;
    if (name === "supplierName") {
      const selectedSupplier = suppliers?.find(
        (supplier) => supplier.name === parsedValue
      );
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
        supplierContact: selectedSupplier?.phone || "",
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const validate = () => {
    const requiredFields = [
      "itemName",
      "itemUnit",
      "category",
      "availableQuantity",
      "lowStockQuantity",
    ];

    const missing = requiredFields.filter(
      (field) =>
        !formData[field] ||
        (typeof formData[field] === "number" && formData[field] <= 0)
    );

    if (missing.length > 0) {
      showToast("All required fields must be filled out", "error");
      return false;
    }

    //Check the barcode is 13 digit ot not
    if (formData.barCode && formData.barCode.length !== 13) {
      showToast("Barcode must be 13 digits", "error");
      return false;
    }

    // Check the expiry date is atleast 1 month from today
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const expiryDate = new Date(formData.expiryDate);
    if (expiryDate < nextMonth) {
      showToast("Expiry date must be atleast 1 month from today", "error");
      return false;
    }

    return true;
  };

  const handleSave = (e) => {
    e.preventDefault();

    const itemData = {
      ...formData,
      purchasePrice: parseGermanCurrency(formData.purchasePrice),
    };

    // Validate form data
    if (!validate()) return;

    // Submit to server
    onSubmit(itemData);
  };

  const handleClose = () => {
    setFormData(initialItemState);
    onClose();
  };

  useEffect(() => {
    if (itemData) {
      setFormData(() => ({
        ...itemData,
        purchasePrice: formatToGermanCurrency(itemData?.purchasePrice),
        expiryDate: formatDateForInput(itemData?.expiryDate),
      }));
    }
    return () => {
      setFormData(initialItemState);
    };
  }, [itemData]);

  const renderTextInput = (label, name, type = "text", isRequired = false) => (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Input
        name={name}
        type={type}
        onChange={handleInputChange}
        value={formData[name] ?? ""}
        placeholder={`eg. ${
          {
            itemName: "Tomato",
            category: "Vegetable",
            itemUnit: "KG",
            availableQuantity: "50",
            lowStockQuantity: "10",
            expiryDate: "2025-12-31",
            purchasePrice: "100 €",
            supplierName: "Fresh Farms",
            supplierContact: "9876543210",
            notes: "Keep refrigerated",
            storedLocation: "Cold Storage",
          }[name] || label
        }`}
      />
    </FormControl>
  );

  const renderSelectInput = (label, name, options = [], isRequired = false) => (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Select
        name={name}
        placeholder="Select option"
        onChange={handleInputChange}
        value={formData[name] ?? ""}
      >
        {options.map((option) => (
          <option key={option + Math.random()} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? "Edit Item" : "Add New Item"}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSave}>
          <ModalBody>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
              {renderTextInput("Item Name", "itemName", "text", true)}
              {renderTextInput("Category", "category", "text", true)}
              {renderTextInput(
                "Available Quantity",
                "availableQuantity",
                "number",
                true
              )}
              {renderTextInput(
                "Low Stock Quantity",
                "lowStockQuantity",
                "number",
                true
              )}
              {renderSelectInput(
                "Item Unit",
                "itemUnit",
                ["Grams", "KG", "Litre", "Piece", "Gallon", "Dozen"],
                true
              )}
              {renderTextInput("Purchase Price", "purchasePrice", "text", true)}
              {renderTextInput("Expiry Date", "expiryDate", "date")}
              {renderTextInput("Barcode No", "barCode")}
              {renderSelectInput(
                "Supplier Name",
                "supplierName",
                suppliers?.map((supplier) => supplier.name),
                true
              )}
              <FormControl>
                <FormLabel>Supplier Contact</FormLabel>
                <Input
                  name="supplierContact"
                  type="text"
                  value={formData.supplierContact ?? ""}
                  placeholder="eg. 1234567890"
                  readOnly
                />
              </FormControl>
              {renderTextInput("Notes", "notes")}
              {renderTextInput("Stored Location", "storedLocation")}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              variant={"solid"}
              colorScheme="gray"
              mr={3}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="solid"
              backgroundColor="rgb(33, 180, 152)"
              color="white"
              type="submit"
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

ItemAddEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
};
