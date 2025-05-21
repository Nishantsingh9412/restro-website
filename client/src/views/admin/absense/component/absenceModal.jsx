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
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useToast } from "../../../../contexts/useToast";
import { formatDateForInput } from "../../../../utils/utils";

export default function LeaveRequestModal({
  isOpen,
  onClose,
  leaveData,
  onSubmit,
  onDelete,
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

  const showToast = useToast();
  const isEdit = Boolean(leaveData && leaveData._id);
  const [formData, setFormData] = useState(initialFormState);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler
  const handleSave = () => {
    if (!validate()) return;
    onSubmit(formData);
    handleClose();
  };

  // Close and reset
  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  // Validate required fields and date logic
  const validate = () => {
    const { type, leaveType, startDate, endDate } = formData;
    if (!type || !leaveType || !startDate || !endDate) {
      showToast("All required fields must be filled out", "error");
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      showToast("End date must be after start date", "error");
      return false;
    }
    return true;
  };

  // Populate form for edit, or reset for add
  useEffect(() => {
    if (leaveData) {
      setFormData((prev) => ({
        ...prev,
        employeeId: leaveData?.employeeId || "",
        type: leaveData?.type || "",
        leaveType: leaveData?.leaveType || "",
        startDate: formatDateForInput(leaveData?.startDate),
        endDate: formatDateForInput(leaveData?.endDate),
        notes: leaveData?.notes || "",
      }));
    }
  }, [leaveData, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxW="400px">
        <ModalHeader textAlign="center">
          {isEdit ? "Edit Leave Request" : "Request Leave"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <FormControl mb={3}>
            <FormLabel>Employee Name</FormLabel>
            <Input
              name="name"
              type="text"
              value={leaveData?.empName || ""}
              readOnly
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Vacation Type</FormLabel>
            <Select
              name="type"
              placeholder="Select type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="Paid vacation">Paid vacation</option>
              <option value="Sick leave">Sick leave</option>
              <option value="Special leave">Special leave</option>
              <option value="Unpaid vacation">Unpaid vacation</option>
            </Select>
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Leave Type</FormLabel>
            <Select
              name="leaveType"
              placeholder="Select leave type"
              value={formData.leaveType}
              onChange={handleInputChange}
            >
              <option value="All Day">All Day</option>
              <option value="First Half">First Half</option>
              <option value="Second Half">Second Half</option>
            </Select>
          </FormControl>
          <HStack spacing={3} mb={3}>
            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </FormControl>
          </HStack>
          <FormControl mb={2}>
            <FormLabel>Notes</FormLabel>
            <Input
              name="notes"
              type="text"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          {isEdit && (
            <Button
              mr={2}
              colorScheme="red"
              onClick={() => {
                onDelete(leaveData._id);
              }}
              borderRadius="8px"
            >
              Delete
            </Button>
          )}
          <Button
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

LeaveRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  leaveData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
