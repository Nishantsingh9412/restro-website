import { useEffect, useState, useCallback } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { actionTypes } from "../../../../utils/constant";

const TaskModal = ({
  isOpen,
  onClose,
  employees,
  handleSubmit,
  editData,
  actionType,
}) => {
  const initialState = {
    title: "",
    description: "",
    assignedTo: "",
    startDate: new Date(),
    endDate: new Date(),
  };
  const [taskDetails, setTaskDetails] = useState(initialState);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTaskDetails(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const onSubmit = useCallback(() => {
    handleSubmit(taskDetails);
    handleClose();
  }, [handleSubmit, taskDetails, handleClose]);

  useEffect(() => {
    if (editData) {
      const { start, end, ...rest } = editData;
      setTaskDetails({
        ...rest,
        startDate: start || editData.startDate,
        endDate: end || editData.endDate,
      });
    }
  }, [editData]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {actionType === actionTypes.ADD ? "Assign New Task" : "Update Task"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={taskDetails.title}
                onChange={handleChange}
                placeholder="Enter task title"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                value={taskDetails.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Assign To</FormLabel>
              <Select
                name="assignedTo"
                placeholder="Select employee"
                value={taskDetails.assignedTo}
                onChange={handleChange}
              >
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Start Date and Time</FormLabel>
              <DatePicker
                selected={taskDetails.startDate}
                onChange={(date) =>
                  setTaskDetails((prevDetails) => ({
                    ...prevDetails,
                    startDate: date,
                  }))
                }
                showTimeSelect
                dateFormat="Pp"
                className="chakra-input"
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Date and Time</FormLabel>
              <DatePicker
                selected={taskDetails.endDate}
                onChange={(date) =>
                  setTaskDetails((prevDetails) => ({
                    ...prevDetails,
                    endDate: date,
                  }))
                }
                showTimeSelect
                dateFormat="Pp"
                className="chakra-input"
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onSubmit} mr={3}>
            {actionType === actionTypes.ADD ? "Assign Task" : "Update Task"}
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employees: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editData: PropTypes.object,
  actionType: PropTypes.string.isRequired,
};

export default TaskModal;
