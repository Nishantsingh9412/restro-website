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
  RadioGroup,
  HStack,
  Radio,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Date conversion utilities
const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // Extract 'yyyy-MM-dd'
};

const formatInputToISO = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString(); // Convert 'yyyy-MM-dd' back to full ISO format
};

export default function EmployeeModal({
  isOpen,
  onClose,
  actionType,
  employeeData,
  handleSubmit,
}) {
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zipCode: "",
    },
    birthday: "",
    nationality: "",
    maritalStatus: "",
    children: "",
    healthInsurance: "",
    socialSecurityNumber: "",
    taxID: "",
    status: "",
    dateOfJoining: "",
    endOfEmployment: "",
    employeeID: "",
    position: "",
    type: "",
    workingHoursPerWeek: 30,
    variableWorkingHours: false,
    annualHolidayEntitlement: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (actionType !== "add" && employeeData) {
      setFormData({
        ...employeeData,
        birthday: formatDateForInput(employeeData.birthday),
        dateOfJoining: formatDateForInput(employeeData.dateOfJoining),
        endOfEmployment: formatDateForInput(employeeData.endOfEmployment),
      });
    }
  }, [actionType, employeeData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle address fields
    if (name.startsWith("address.")) {
      const field = name.split(".")[1]; // Extract the nested field (e.g., "street", "city")
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value, // Update the specific field in the address
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      variableWorkingHours: value === "variable",
    }));
  };

  const validate = () => {
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.phone === "" ||
      formData.employeeID === "" ||
      formData.status === "" ||
      formData.type === ""
    ) {
      toast.error("All required fields must be filled out");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Convert date fields back to ISO format
    const dataToSubmit = {
      ...formData,
      birthday: formatInputToISO(formData.birthday),
      dateOfJoining: formatInputToISO(formData.dateOfJoining),
      endOfEmployment: formatInputToISO(formData.endOfEmployment),
    };

    handleSubmit(dataToSubmit);
    handleClose();
  };

  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((prev, key) => prev?.[key], obj);
  };

  const renderInput = (
    label,
    name,
    type = "text",
    isSelect = false,
    options = []
  ) => (
    <>
      <label>{label}</label>
      {isSelect ? (
        <Select
          name={name}
          placeholder="Select option"
          mb={4}
          onChange={handleInputChange}
          value={getNestedValue(formData, name) || ""}
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
          value={getNestedValue(formData, name) || ""}
        />
      )}
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent maxWidth={{ base: "90%", md: "70%" }}>
        <ModalCloseButton />
        <ModalHeader>
          {actionType === "edit" ? "Edit Employee" : "Add New Employee"}
        </ModalHeader>
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              {renderInput("Employee name", "name")}
              {renderInput("Email", "email", "email")}
              {renderInput("Phone", "phone")}
              {renderInput("Street", "address.street")}
              {renderInput("City", "address.city")}
              {renderInput("Zip code", "address.zipCode", "number")}
              {renderInput("Birthday", "birthday", "date")}
              {renderInput("Nationality", "nationality")}
              {renderInput("Marital status", "maritalStatus", "text", true, [
                "Single",
                "Married",
                "Divorced",
              ])}
              {renderInput("Children", "children", "number")}
              {renderInput("Health insurance", "healthInsurance")}
              {renderInput(
                "Social security number",
                "socialSecurityNumber",
                "number"
              )}
              {renderInput("Tax ID", "taxID", "number")}
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              {renderInput("Status", "status", "text", true, [
                "Active",
                "Inactive",
                "Suspended",
              ])}
              {renderInput("Date of joining", "dateOfJoining", "date")}
              {renderInput("End of employment", "endOfEmployment", "date")}
              {renderInput("Employee ID", "employeeID", "number")}
              {renderInput("Position", "position", "text", true, [
                "Waiter",
                "Manager",
                "Chef",
              ])}
              {renderInput("Type", "type", "text", true, [
                "Full-time",
                "Part-time",
                "Contract",
              ])}
              <RadioGroup
                onChange={handleRadioChange}
                value={formData.variableWorkingHours ? "variable" : "fixed"}
              >
                <HStack>
                  <Radio value="fixed">
                    Fixed working hours per week
                    <Input
                      name="workingHoursPerWeek"
                      type="number"
                      value={
                        formData.variableWorkingHours
                          ? ""
                          : formData.workingHoursPerWeek
                      }
                      onChange={handleInputChange}
                    />
                  </Radio>
                  <Radio value="variable">Variable working hours</Radio>
                </HStack>
              </RadioGroup>
              {renderInput(
                "Annual holiday entitlement (days)",
                "annualHolidayEntitlement",
                "number"
              )}
              {renderInput("Notes", "notes")}
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          {actionType !== "view" ? (
            <>
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
            </>
          ) : null}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
