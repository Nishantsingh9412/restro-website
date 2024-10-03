/* eslint-disable no-unused-vars */
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
  FormControl,
  FormLabel,
  Input,
  Select,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Utility function to format date
const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // Extract 'yyyy-MM-dd'
};

// Main component for Leave Request Modal
export default function LeaveRequestModal({
  isOpen, // Boolean to control modal visibility
  onClose, // Function to close the modal
  actionType, // Type of action: 'edit' or 'create'
  leaveData, // Data for the leave request
  handleSubmit, // Function to handle form submission
  deleteLeaveRequest, // Function to handle leave request deletion
}) {
  // Initial state for the form
  const initialFormState = {
    employeeId: "",
    type: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    notes: "",
    declineAssignedShifts: true,
  };

  // State to manage form data
  const [formData, setFormData] = useState(initialFormState);

  // Effect to populate form data when editing
  useEffect(() => {
    if (actionType === "edit" && leaveData) {
      // Destructure to exclude unnecessary fields
      const { createdAt, emp_name, updatedAt, __v, ...requiredData } =
        leaveData;
      setFormData({
        ...requiredData,
        startDate: formatDateForInput(leaveData?.startDate),
        endDate: formatDateForInput(leaveData?.endDate),
      });
    } else
      setFormData((prev) => ({
        ...prev,
        startDate: leaveData?.startDate,
      }));
  }, [actionType, leaveData]);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form data before submission
  const validate = () => {
    const { leaveType, startDate, endDate, type } = formData;
    if (!leaveType || !startDate || !endDate || !type) {
      toast.error("All required fields must be filled out");
      return false;
    }
    return true;
  };

  // Handle form save action
  const handleSave = () => {
    if (!validate()) return;

    handleSubmit(formData);
    handleClose();
  };

  // Handle modal close action
  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  // Render input fields with labels
  const renderInput = (
    label, // Label for the input
    name, // Name attribute for the input
    type = "text", // Type of the input
    isSelect = false, // Boolean to determine if input is a select dropdown
    options = [], // Options for select dropdown
    isRequired = true // Boolean to determine if input is required
  ) => (
    <>
      <FormLabel>
        {label} {isRequired && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
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

  // Render the modal component
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxWidth="40%">
        <ModalHeader
          bg="#00a7c4"
          color="white"
          textAlign="center"
          borderTopRadius="8px"
        >
          {actionType === "edit" ? "Edit Leave Request" : "Request Leave"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormLabel>Employee Name</FormLabel>
          <Input
            name="name"
            type="text"
            mb={4}
            value={leaveData?.emp_name}
            readOnly={true}
          />
          {renderInput("Vacation Type", "type", "text", true, [
            "Paid vacation",
            "Sick leave",
            "Special leave",
            "Unpaid vacation",
          ])}
          {renderInput("Leave Type", "leaveType", "text", true, [
            "All Day",
            "First Half",
            "Second Half",
          ])}
          <HStack spacing={4} mt={4}>
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </FormControl>
          </HStack>
          {renderInput("Notes", "notes", "text", false, [], false)}
        </ModalBody>
        <ModalFooter>
          {actionType === "edit" && (
            <Button
              mr={3}
              colorScheme="red"
              onClick={deleteLeaveRequest}
              borderRadius="8px"
            >
              Delete
            </Button>
          )}
          <Button
            mr={3}
            colorScheme="gray"
            onClick={handleClose}
            borderRadius="8px"
          >
            Cancel
          </Button>
          <Button
            mr={3}
            colorScheme="teal"
            onClick={handleSave}
            borderRadius="8px"
            color="white"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
