import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
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
} from "@chakra-ui/react";

import { AllEmployeesAPI, updateTaskAPI } from "../../../../api/index.js";

const UpdateTask = (props) => {
  const {
    isOpen,
    onOpen,
    onClose,
    // employees,
    // taskDetails,
    // setTaskDetails,
    // handleSubmit
  } = props;

  const [employees, setEmployees] = useState([]);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    assignedTo: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleTaskEdit = () => {
    updateTaskAPI({
      title: taskDetails.title,
      description: taskDetails.description,
      assignedTo: taskDetails.assignedTo,
      startDate: taskDetails.startDate,
      endDate: taskDetails.endDate,
    })
      .then((response) => {
        // console.log('Event updated:', response.data);
      })
      .catch((err) => {
        // console.log('Error from update task API:');
        // console.log(err);
      });
  };

  useEffect(() => {
    AllEmployeesAPI()
      .then((response) => {
        setEmployees(response?.data?.result);
      })
      .catch((err) => {
        // console.log('Error from get all employees API:');
        // console.log(err);
      });
  }, []);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={taskDetails.title}
                onChange={(e) =>
                  setTaskDetails({ ...taskDetails, title: e.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={taskDetails.description}
                onChange={(e) =>
                  setTaskDetails({
                    ...taskDetails,
                    description: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Assign To</FormLabel>
              <Select
                placeholder="Select employee"
                value={taskDetails.assignedTo}
                onChange={(e) =>
                  setTaskDetails({ ...taskDetails, assignedTo: e.target.value })
                }
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
                  setTaskDetails({ ...taskDetails, startDate: date })
                }
                showTimeSelect
                dateFormat="Pp"
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Date and Time</FormLabel>
              <DatePicker
                selected={taskDetails.endDate}
                onChange={(date) =>
                  setTaskDetails({ ...taskDetails, endDate: date })
                }
                showTimeSelect
                dateFormat="Pp"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleTaskEdit}>
              Assign Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateTask;
