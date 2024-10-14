/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
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
  useDisclosure,
  Stack,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  AllEmployeesAPI,
  updateTaskAPI,
  assignTaskAPI,
  getAllTasksAPI,
  deleteTaskAPI,
} from "../../../api/index.js";
import UpdateTask from "./components/UpdateTask.jsx";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const EmployeeManagement = () => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const {
    isOpen: isUpdateOpen,
    onOpen: isUpdateOnOpen,
    onClose: isUpdateOnClose,
  } = useDisclosure();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    assignedTo: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [employees, setEmployees] = useState([]);

  const localUser = JSON.parse(localStorage.getItem("ProfileData"));
  const localUserId = localUser?.result?._id;

  useEffect(() => {
    const fetchTasksAndEmployees = async () => {
      try {
        const tasksResponse = await getAllTasksAPI();
        const tasks = tasksResponse?.data?.result.map((task) => ({
          title: task.title,
          start: new Date(task.startDate),
          end: new Date(task.endDate),
          id: task._id,
        }));
        setEvents(tasks);

        const employeesResponse = await AllEmployeesAPI();
        setEmployees(employeesResponse?.data?.result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchTasksAndEmployees();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setIsOpen(true);
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      startDate: slotInfo.start,
      endDate: slotInfo.end,
    }));
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents((prevEvents) =>
      prevEvents.map((evt) => (evt.id === event.id ? updatedEvent : evt))
    );

    try {
      await updateTaskAPI({ ...updatedEvent, startDate: start, endDate: end });
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleSubmit = async () => {
    const newTask = {
      ...taskDetails,
      created_by: localUserId,
    };

    try {
      const response = await assignTaskAPI(newTask);
      const task = response?.data?.result;
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          title: task.title,
          start: new Date(task.startDate),
          end: new Date(task.endDate),
          id: task._id,
        },
      ]);
      setIsOpen(false);
    } catch (err) {
      console.error("Error assigning task:", err);
    }
  };

  const handleDelete = async (event) => {
    try {
      await deleteTaskAPI(event.id);
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const eventPropGetter = (event, start, end, isSelected) => ({
    style: {
      backgroundColor: isSelected ? "#ff6347" : "#4682b4",
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
      padding: "5px",
    },
  });

  const Event = ({ event }) => (
    <Flex align="center" justify="space-between">
      <Text fontWeight="bold">{event.title}</Text>
      <Stack direction="row" spacing={2}>
        <Button colorScheme="green" size="xs" onClick={isUpdateOnOpen}>
          Edit
        </Button>
        <Button colorScheme="red" size="xs" onClick={() => handleDelete(event)}>
          Delete
        </Button>
      </Stack>
    </Flex>
  );

  return (
    <Box padding="2rem">
      <Heading as="h1" size="xl" mb="4">
        Employee Management
      </Heading>
      <DnDCalendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventPropGetter}
        components={{ event: Event }}
      />
      <TaskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        taskDetails={taskDetails}
        setTaskDetails={setTaskDetails}
        employees={employees}
        handleSubmit={handleSubmit}
      />
      <UpdateTask
        isOpen={isUpdateOpen}
        onOpen={isUpdateOnOpen}
        onClose={isUpdateOnClose}
        selectedTask={selectedSlot}
      />
    </Box>
  );
};

const TaskModal = ({
  isOpen,
  onClose,
  taskDetails,
  setTaskDetails,
  employees,
  handleSubmit,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Assign Task</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={4}>
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
                setTaskDetails({ ...taskDetails, description: e.target.value })
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
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" onClick={handleSubmit}>
          Assign Task
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default EmployeeManagement;
