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
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  formatDateForInput,
  formatInputToISO,
  getNestedValue,
} from "../../../../../utils/utils";
import { useState, useEffect } from "react";
import { useToast } from "../../../../../contexts/useToast";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  actionTypes,
  employeePermissions,
  employeesRoles,
  userTypes,
} from "../../../../../utils/constant";
import PropTypes from "prop-types";
import { useUser } from "../../../../../hooks/useUser";

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
    maritalStatus: null,
    childrens: 0,
    healthInsurance: "",
    socialSecurityNumber: "",
    taxId: "",
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Check if a permission is selected
  const isChecked = (id) => selectedPermissions.includes(id);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    // Destructure name and value from the event target
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
      workingHoursPerWeek:
        value === "variable" ? null : prev.workingHoursPerWeek,
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

  // Handle modal close and Reset form data and selected permissions
  const handleClose = () => {
    setFormData(initialFormState);
    setSelectedPermissions([]);
    onClose();
  };

  // Enhanced validate function to set errors
  const validate = () => {
    const requiredFields = ["name", "email", "phone", "role", "empType"];
    const newErrors = {};

    // Check for required fields
    for (const field of requiredFields) {
      if (!formData[field]) {
        newErrors[field] = `Please enter ${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()}`;
      }
    }
    // Validate phone number format
    if (formData.phone && !parsePhoneNumber(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast("Please fix the errors in the form.", "error");
      return false;
    }
    return true;
  };

  // Handle save action
  const handleSave = async (e) => {
    e.preventDefault();
    // Validate form data before submission
    if (!validate()) return;

    setIsLoading(true);
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

    // Call the onSubmit function passed as a prop
    const res = await onSubmit(dataToSubmit);
    // Show success or error message based on the response
    setIsLoading(false);
    if (res.success) {
      handleClose();
    }
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

  const autoFill = () => {
    // Utility to generate a random number string
    function randomNumberString(length = 6) {
      const nums = "0123456789";
      return Array.from(
        { length },
        () => nums[Math.floor(Math.random() * nums.length)]
      ).join("");
    }

    // Utility to pick a random item from an array
    function randomPick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    const firstNames = [
      "John",
      "Jane",
      "Alex",
      "Maria",
      "Chris",
      "Sara",
      "Max",
      "Lina",
    ];
    const lastNames = [
      "Smith",
      "Doe",
      "Brown",
      "Müller",
      "Schmidt",
      "Fischer",
      "Weber",
      "Becker",
    ];
    const cities = ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"];
    const streets = [
      "Main St",
      "Park Ave",
      "Bahnhofstrasse",
      "Hauptstrasse",
      "Ringstrasse",
    ];
    const nationalities = ["German", "French", "Italian", "Spanish", "Turkish"];
    const maritalStatuses = ["Single", "Married", "Divorced"];
    const roles = Object.values(employeesRoles);
    const empTypes = ["Full-Time", "Part-Time", "Contract"];

    const firstName = randomPick(firstNames);
    const lastName = randomPick(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumberString(
      2
    )}@example.com`;
    const phone = `+4915${randomNumberString(8)}`;
    const country_code = "49";
    const street = `${randomNumberString(2)} ${randomPick(streets)}`;
    const city = randomPick(cities);
    const zipCode = randomNumberString(5);
    const birthday = `${1980 + Math.floor(Math.random() * 25)}-${String(
      1 + Math.floor(Math.random() * 12)
    ).padStart(2, "0")}-${String(1 + Math.floor(Math.random() * 28)).padStart(
      2,
      "0"
    )}`;
    const nationality = randomPick(nationalities);
    const maritalStatus = randomPick(maritalStatuses);
    const childrens = String(Math.floor(Math.random() * 4));
    const healthInsurance = randomPick(["AOK", "TK", "Barmer", "DAK"]);
    const socialSecurityNumber = randomNumberString(10);
    const taxId = randomNumberString(11);
    const dateOfJoining = `20${String(
      10 + Math.floor(Math.random() * 15)
    ).padStart(2, "0")}-${String(1 + Math.floor(Math.random() * 12)).padStart(
      2,
      "0"
    )}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, "0")}`;
    const endOfEmployment = "";
    const role = randomPick(roles);
    const empType = randomPick(empTypes);
    const workingHoursPerWeek = [20, 30, 35, 40][Math.floor(Math.random() * 4)];
    const variableWorkingHours = Math.random() > 0.5;
    const annualHolidayEntitlement = String(
      20 + Math.floor(Math.random() * 11)
    );
    const notes = "Auto-generated employee";
    const is_online = Math.random() > 0.5;

    setFormData({
      name,
      email,
      phone,
      country_code,
      address: {
        street,
        city,
        zipCode,
      },
      birthday,
      nationality,
      maritalStatus,
      childrens,
      healthInsurance,
      socialSecurityNumber,
      taxId,
      dateOfJoining,
      endOfEmployment,
      role,
      empType,
      workingHoursPerWeek,
      variableWorkingHours,
      annualHolidayEntitlement,
      notes,
      is_online,
    });
  };

  // Updated renderInput to use FormControl and FormLabel
  const renderInput = (
    label,
    name,
    type = "text",
    isSelect = false,
    options = [],
    isRequired = false
  ) => (
    <FormControl
      isInvalid={!!errors[name]}
      isRequired={isRequired}
      mb={4}
      isReadOnly={actionType === actionTypes.VIEW}
    >
      <FormLabel>{label}</FormLabel>
      {isSelect ? (
        <Select
          name={name}
          placeholder="Select option"
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
          required={isRequired}
          placeholder={`Enter ${label.toLowerCase()}`}
          onChange={handleInputChange}
          value={getNestedValue(formData, name) || ""}
          isReadOnly={actionType === actionTypes.VIEW}
        />
      )}
      <FormErrorMessage>{errors[name]}</FormErrorMessage>
    </FormControl>
  );

  // Phone input with FormControl
  const renderPhoneInput = () => (
    <FormControl isInvalid={!!errors.phone} isRequired mb={4}>
      <FormLabel>Phone number</FormLabel>
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
      <FormErrorMessage>{errors.phone}</FormErrorMessage>
    </FormControl>
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
        <form onSubmit={handleSave}>
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                {renderInput("Employee name", "name", "text", false, [], true)}
                {renderInput("Email", "email", "email", false, [], true)}
                {renderPhoneInput()}
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
                {renderInput("Children", "childrens", "number")}
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
                  <FormControl mb={4}>
                    <FormLabel>Working Hours Type</FormLabel>
                    <HStack>
                      <Radio value="fixed">Fixed</Radio>
                      <Radio value="variable">Variable</Radio>
                    </HStack>
                  </FormControl>
                </RadioGroup>
                {!formData.variableWorkingHours &&
                  renderInput(
                    "Working Hours (weekly)",
                    "workingHoursPerWeek",
                    "number"
                  )}
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
                {renderInput("Tax ID", "taxId", "number")}
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
              <>
                <Button variant="ghost" onClick={autoFill} type="button">
                  AUTO FILL
                </Button>
                <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  isLoading={isLoading}
                >
                  {actionType === actionTypes.ADD ? "Add" : "Update"}
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={handleClose}>
              {actionType === actionTypes.VIEW ? "Close" : "Cancel"}
            </Button>
          </ModalFooter>
        </form>
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
