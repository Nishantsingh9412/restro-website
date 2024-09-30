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

export default function LeaveRequestModal({
  isOpen,
  onClose,
  actionType,
  leaveData,
  handleSubmit,
  deleteLeaveRequest,
}) {
  const initialFormState = {
    employeeId: "",
    type: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    notes: "",
    declineAssignedShifts: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (actionType === "edit" && leaveData) {
      // eslint-disable-next-line no-unused-vars
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { leaveType, startDate, endDate, type } = formData;
    if (!leaveType || !startDate || !endDate || !type) {
      toast.error("All required fields must be filled out");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    handleSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  const renderInput = (
    label,
    name,
    type = "text",
    isSelect = false,
    options = [],
    isRequired = true
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
