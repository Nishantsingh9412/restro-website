import React from "react";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
} from "@chakra-ui/react";
import {
  formatDateForInput,
  formatInputToISO,
  getNestedValue,
} from "../../../../utils/utils";
import { useState, useEffect } from "react";
import { useToast } from "../../../../contexts/useToast";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  actionTypes,
  employeePermissions,
  employeesRoles,
  userTypes,
} from "../../../../utils/constant";
import PropTypes from "prop-types";
import { useUser } from "../../../../hooks/useUser";

export default function EmployeeModal({
  isOpen,
  onClose,
  actionType,
  employeeData,
  onSubmit,
}) {
  // Initial state for the form
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    country_code: "",
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
    dateOfJoining: "",
    endOfEmployment: "",
    role: "",
    empType: "",
    workingHoursPerWeek: 30,
    variableWorkingHours: false,
    annualHolidayEntitlement: "",
    notes: "",
    is_online: false,
  };

  const showToast = useToast();
  const { userRole } = useUser();
  const [formData, setFormData] = useState(initialFormState);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Check if a permission is selected
  const isChecked = (id) => selectedPermissions.includes(id);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle address fields separately
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

  // Handle radio button changes
  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      variableWorkingHours: value === "variable",
    }));
  };

  // Handle permission toggle
  const handleToggle = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((optionId) => optionId !== id)
        : [...prev, id]
    );
  };

  // Handle phone input change and update phone number and country code
  const handlePhoneInputChange = (phoneNumber) => {
    setFormData((prevData) => ({
      ...prevData,
      phone: phoneNumber,
    }));

    if (typeof phoneNumber === "string") {
      try {
        const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
        if (parsedPhoneNumber) {
          setFormData((prevData) => ({
            ...prevData,
            country_code: parsedPhoneNumber.countryCallingCode,
          }));
        }
      } catch (e) {
        // Optionally show a toast or ignore
        console.error("Error parsing phone number:", e);
      }
    }
  };

  // Handle modal close action
  const handleClose = () => {
    setFormData(initialFormState);
    setSelectedPermissions([]);
    onClose();
  };

  // Validate required fields
  const validate = () => {
    const requiredFields = ["name", "email", "phone", "role", "empType"];

    // Check if all required fields are filled
    for (const field of requiredFields) {
      if (!formData[field]) {
        showToast(
          `Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          "error"
        );
        return false;
      }
    }
    // Check if phone number is valid
    if (formData.phone && !parsePhoneNumber(formData.phone)) {
      showToast("Invalid phone number", "error");
      return false;
    }

    return true;
  };

  // Handle save action
  const handleSave = () => {
    if (!validate()) return;

    // Convert selected permissions to the required format
    const selectedPermissionsAccess = employeePermissions
      .filter((role) => selectedPermissions.includes(role.id))
      .map((role) => ({
        id: role.id,
        label: role.label.split(" ").join("-"),
      }));

    // Convert date fields back to ISO format and submit the form data
    const dataToSubmit = {
      ...formData,
      permissions: selectedPermissionsAccess,
      birthday: formatInputToISO(formData.birthday),
      dateOfJoining: formatInputToISO(formData.dateOfJoining),
      endOfEmployment: formatInputToISO(formData.endOfEmployment),
    };

    onSubmit(dataToSubmit);
    handleClose();
  };

  // Effect to populate form data when editing an employee
  useEffect(() => {
    if (actionType !== actionTypes.ADD && employeeData) {
      setFormData({
        ...employeeData,
        birthday: formatDateForInput(employeeData.birthday),
        dateOfJoining: formatDateForInput(employeeData.dateOfJoining),
        endOfEmployment: formatDateForInput(employeeData.endOfEmployment),
      });
      setSelectedPermissions(
        Array.isArray(employeeData.permissions)
          ? employeeData.permissions.map((role) => role.id)
          : []
      );
    }
  }, [actionType, employeeData]);

  // Render input fields
  const renderInput = (
    label,
    name,
    type = "text",
    isSelect = false,
    options = [],
    isRequired = false
  ) => (
    <>
      <label>
        {label} {isRequired && <span style={{ color: "red" }}>*</span>}
      </label>
      {isSelect ? (
        <Select
          name={name}
          placeholder="Select option"
          mb={4}
          onChange={handleInputChange}
          value={getNestedValue(formData, name) || ""}
          isReadOnly={actionType === actionTypes.VIEW}
        >
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          name={name}
          type={type}
          isRequired={isRequired}
          placeholder={`Enter ${label.toLowerCase()}`}
          mb={4}
          onChange={handleInputChange}
          value={getNestedValue(formData, name) || ""}
          isReadOnly={actionType === actionTypes.VIEW}
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
          {actionType === actionTypes.EDIT
            ? "Edit Employee"
            : "Add New Employee"}
        </ModalHeader>
        {/* <form onSubmit={handleSave}> */}
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              {renderInput("Employee name", "name", "text", false, [], true)}
              {renderInput("Email", "email", "email", false, [], true)}
              <label>
                Phone number <span style={{ color: "red" }}>*</span>
              </label>
              <PhoneInput
                international
                defaultCountry="DE"
                value={formData.phone}
                onChange={handlePhoneInputChange}
                placeholder="Enter phone number"
                inputComponent={CustomInput}
                readOnly={actionType === actionTypes.VIEW}
                inputProps={{
                  _focus: {
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px blue.500",
                  },
                }}
                style={{ width: "100%" }}
              />
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
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              {renderInput("Date of joining", "dateOfJoining", "date")}
              {renderInput("End of employment", "endOfEmployment", "date")}

              {renderInput(
                "Role",
                "role",
                "text",
                true,
                Object.values(employeesRoles),
                true
              )}
              {renderInput(
                "Employee type",
                "empType",
                "text",
                true,
                ["Full-Time", "Part-Time", "Contract"],
                true
              )}
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
              {renderInput("Health insurance", "healthInsurance")}
              {renderInput(
                "Social security number",
                "socialSecurityNumber",
                "number"
              )}
              {renderInput("Tax ID", "taxID", "number")}
              {renderInput("Notes", "notes")}
            </GridItem>
          </Grid>
          {userRole === userTypes.ADMIN && (
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Select Role Access
              </MenuButton>
              <MenuList>
                {employeePermissions.map((option) => (
                  <MenuItem key={option.id}>
                    <Checkbox
                      isChecked={isChecked(option.id)}
                      onChange={() => handleToggle(option.id)}
                    >
                      {option.label}
                    </Checkbox>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </ModalBody>
        <ModalFooter>
          {actionType !== actionTypes.VIEW && (
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              {actionType === actionTypes.ADD ? "Add" : "Update"}
            </Button>
          )}
          <Button variant="ghost" onClick={handleClose}>
            {actionType === actionTypes.VIEW ? "Close" : "Cancel"}
          </Button>
        </ModalFooter>
        {/* </form> */}
      </ModalContent>
    </Modal>
  );
}

const CustomInput = React.forwardRef(({ inputProps, ...props }, ref) => {
  return <Input ref={ref} {...inputProps} {...props} />;
});
CustomInput.displayName = "CustomInput";

CustomInput.propTypes = {
  inputProps: PropTypes.object,
};

EmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actionType: PropTypes.string.isRequired,
  employeeData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
