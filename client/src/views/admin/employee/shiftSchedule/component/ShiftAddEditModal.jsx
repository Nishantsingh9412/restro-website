import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { formatDateForInput } from "../../../../../utils/utils";
import { useToast } from "../../../../../contexts/useToast";

function formatTimeForInput(time) {
  if (!time) return "";
  const newTime = new Date(time);
  const formattedTime = newTime.toISOString().slice(11, 16);
  return formattedTime;
}

// Generate Time to Select Hours
const timesList = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

const ShiftModal = ({
  isOpen,
  onClose,
  shiftData,
  onSubmit,
  handleDeleteShift,
  isSubmitting,
}) => {
  const initialFormState = {
    employeeId: null,
    from: "",
    to: "",
    note: "",
    date: "",
  };
  const showToast = useToast();
  const { employeeId, from, to, note, date, empName } = shiftData;
  const [formData, setFormData] = useState(initialFormState);
  const isEditMode = Boolean(shiftData && shiftData._id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate the form data
  const validate = () => {
    const { employeeId, from, to, date } = formData;

    if (!date || !employeeId || !from || !to) {
      showToast("All fields are required", "error");
      return false;
    }
    //Check the date is after today or not
    const today = new Date();
    const tomorrowsDate = today.setDate(today.getDate() + 1);

    const selectedDate = new Date(date);
    if (selectedDate < tomorrowsDate) {
      showToast("The selected date cannot be in the past.", "error");
      return false;
    }

    // Check if the shift duration is at least 1 hour
    const fromTime = new Date(`1970-01-01T${from}:00`);
    const toTime = new Date(`1970-01-01T${to}:00`);
    if ((toTime - fromTime) / (1000 * 60 * 60) < 1) {
      showToast("The shift duration must be at least 1 hour.", "error");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(formData);
  };

  // SetFormData for edit mode
  useEffect(() => {
    if (shiftData) {
      setFormData({
        employeeId: employeeId || "",
        from: formatTimeForInput(from) || "",
        to: formatTimeForInput(to) || "",
        note: note || "",
        date: formatDateForInput(date) || "",
      });
    } else {
      setFormData(initialFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? "Edit" : "Add"} Shift</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl>
              <FormLabel>Employee Name</FormLabel>
              <Input type="text" value={empName} readOnly />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </FormControl>

            {["from", "to"].map((field) => (
              <FormControl mt={4} isRequired key={field}>
                <FormLabel>
                  {field === "from" ? "From Time" : "To Time"}
                </FormLabel>
                <Select
                  value={formData[field]}
                  onChange={handleChange}
                  name={field}
                >
                  <option value="">Select time</option>
                  {timesList.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ))}

            <FormControl mt={4}>
              <FormLabel>Note</FormLabel>
              <Textarea
                value={formData.note}
                onChange={handleChange}
                name="note"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={isSubmitting}
            >
              {isEditMode ? "Update" : "Add Shift"}
            </Button>

            {isEditMode && (
              <Button
                colorScheme="red"
                onClick={() => handleDeleteShift(shiftData._id)}
              >
                Delete
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

ShiftModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  shiftData: PropTypes.object, // Add this line for shiftData prop validation
  onSubmit: PropTypes.func.isRequired,
  handleDeleteShift: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

export default ShiftModal;
