import { useEffect, useState } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { formatDateForInput, formatInputToISO } from "../../utils/utils";
import { useToast } from "../../contexts/useToast";
import { actionTypes, employeePermissions } from "../../utils/constant";
import { useUser } from "../useUser";

export function useEmployeeForm({
  actionType,
  employeeData,
  onSubmit,
  onClose,
}) {
  const showToast = useToast();

  // Initial state for the employee form
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    country_code: "",
    address: { street: "", city: "", zipCode: "" },
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

  const { userRole } = useUser();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes for text, number, and select fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested address fields
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle phone input changes and extract country code
  const handlePhoneInputChange = (phoneNumber) => {
    setFormData((prev) => ({ ...prev, phone: phoneNumber }));
    if (typeof phoneNumber === "string") {
      try {
        const parsed = parsePhoneNumber(phoneNumber);
        if (parsed) {
          setFormData((prev) => ({
            ...prev,
            country_code: parsed.countryCallingCode,
          }));
        }
      } catch (err) {
        // Ignore parse errors, just log for debugging
        console.error("Phone parse error", err);
      }
    }
  };

  // Handle radio button changes for working hours type
  const handleRadioChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      variableWorkingHours: value === "variable",
      workingHoursPerWeek:
        value === "variable" ? null : prev.workingHoursPerWeek,
    }));
  };

  // Toggle permission selection for role access
  const handleToggle = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Validate required fields and input formats
  const validate = () => {
    const requiredFields = ["name", "email", "phone", "role", "empType"];
    const newErrors = {};

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

  // Handle form submission: validate, prepare payload, and call onSubmit
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    // Prepare permissions array for submission
    const permissions = employeePermissions
      .filter((perm) => selectedPermissions.includes(perm.id))
      .map((perm) => ({ id: perm.id, label: perm.label.replace(/ /g, "-") }));

    // Prepare payload with formatted dates
    const payload = {
      ...formData,
      permissions,
      birthday: formatInputToISO(formData.birthday),
      dateOfJoining: formatInputToISO(formData.dateOfJoining),
      endOfEmployment: formatInputToISO(formData.endOfEmployment),
    };

    const res = await onSubmit(payload);
    setIsLoading(false);
    if (res.success) handleClose();
  };

  // Reset form and permissions, then close modal
  const handleClose = () => {
    setFormData(initialFormState);
    setSelectedPermissions([]);
    onClose();
  };

  // Check if a permission is selected
  const isChecked = (id) => selectedPermissions.includes(id);

  // Populate form data and permissions when editing an employee
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
          ? employeeData.permissions.map((perm) => perm.id)
          : []
      );
    }
  }, [actionType, employeeData]);

  return {
    formData,
    errors,
    userRole,
    showRoleDropdown,
    setShowRoleDropdown,
    isLoading,
    selectedPermissions,
    isChecked,
    handleInputChange, // Handles all text/select/number input changes
    handleRadioChange, // Handles working hours radio button changes
    handleToggle, // Handles permission checkbox toggling
    handlePhoneInputChange, // Handles phone input and country code extraction
    handleSave, // Handles form validation and submission
    handleClose, // Resets form and closes modal
    setFormData,
    setSelectedPermissions,
  };
}
