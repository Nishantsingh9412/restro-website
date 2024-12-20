/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Box,
  Button,
  useDisclosure,
  Stack,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskModal from "./components/TaskModal";
import Swal from "sweetalert2";

import {
  AllEmployeesAPI,
  updateTaskAPI,
  assignTaskAPI,
  getAllTasksAPI,
  deleteTaskAPI,
} from "../../../api/index.js";

// Initialize localizer for the calendar
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const EmployeeManagement = () => {
  // State to manage events
  const [events, setEvents] = useState([]);
  // State to manage modal visibility
  const { isOpen, onOpen, onClose } = useDisclosure();
  // State to manage selected slot
  // eslint-disable-next-line no-unused-vars
  const [selectedSlot, setSelectedSlot] = useState(null);
  // State to manage task details
  const [selectedTask, setSelectedTask] = useState(null);
  // State to manage action type
  const [actionType, setActionType] = useState("add");
  // State to manage employees list
  const [employees, setEmployees] = useState([]);

  // Get local user data from localStorage
  const localUser = JSON.parse(localStorage.getItem("ProfileData"));
  const localUserId = localUser?.result?._id;

  // Handle slot selection in the calendar
  const handleSelectSlot = (slotInfo) => {
    onOpen();
    setSelectedSlot(slotInfo);
    const { start, end } = slotInfo;
    setSelectedTask((prevDetails) => ({
      ...prevDetails,
      startDate: start,
      endDate: end,
    }));
    console.log(slotInfo);
  };

  // Handle event drop in the calendar
  const handleEventDrop = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents((prevEvents) =>
      prevEvents.map((evt) => (evt.id === event.id ? updatedEvent : evt))
    );

    try {
      const res = await updateTaskAPI({
        ...updatedEvent,
        startDate: start,
        endDate: end,
      });
      if (res.status === 200) {
        toast.success("Task updated successfully");
      } else {
        toast.error("Error updating task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Handle task submission
  const handleSubmit = async (taskData) => {
    const { id, ...rest } = { ...taskData, created_by: localUserId };
    const apiCall =
      actionType === "add" ? assignTaskAPI(rest) : updateTaskAPI(id, rest);

    try {
      const { status, data } = await apiCall;
      const task = data?.result;
      const event = {
        title: task.title,
        assignedTo: task.assignedTo,
        description: task.description,
        start: new Date(task.startDate),
        end: new Date(task.endDate),
        id: task._id,
      };

      if (status === 201) {
        toast.success("Task assigned successfully");
        setEvents((prev) => [...prev, event]);
      } else if (status === 200) {
        toast.success("Task updated successfully");
        setEvents((prev) =>
          prev.map((evt) => (evt.id === task._id ? event : evt))
        );
      } else {
        toast.error("Error assigning task");
      }
    } catch (err) {
      console.error("Error assigning task:", err);
    }
  };

  // Handle item deletion
  const handleDeleteItem = (event) => {
    const style = document.createElement("style");
    style.innerHTML = `
    .swal-bg {
        background-color: #F3F2EE !important;
    }
    .swal-border {
        border: 5px solid #fff !important;
    }`;
    document.head.appendChild(style);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal-bg swal-border",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(event);
      }
    });
  };

  // Handle task deletion
  const handleDelete = async (event) => {
    try {
      await deleteTaskAPI(event.id);
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = (event) => {
    onOpen();
    setSelectedTask(event);
    setActionType("edit");
    console.log(event);
  };

  const handleClose = () => {
    onClose();
    setSelectedTask(null);
    setActionType("add");
  };

  // Fetch tasks and employees on component mount
  useEffect(() => {
    const fetchTasksAndEmployees = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await getAllTasksAPI();
        if (tasksResponse.status !== 200) {
          toast.error("Error fetching tasks");
        } else {
          const allTasks = tasksResponse?.data?.result.map((task) => ({
            title: task.title,
            assignedTo: task.assignedTo,
            description: task.description,
            start: new Date(task.startDate),
            end: new Date(task.endDate),
            id: task._id,
          }));
          setEvents(allTasks);
          console.table(allTasks);
        }
        // Fetch employees
        const employeesResponse = await AllEmployeesAPI();
        if (employeesResponse.status === 200) {
          setEmployees(employeesResponse?.data?.result);
        } else {
          toast.error("Error fetching employees");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchTasksAndEmployees();
  }, []);

  // Customize event appearance in the calendar
  const eventPropGetter = (isSelected) => ({
    style: {
      backgroundColor: !isSelected ? "#ff6347" : "#4682b4",
      borderRadius: "1px",
      opacity: 0.9,
      color: "white",
      display: "block",
      padding: "1px",
    },
  });

  // Custom event component
  const Event = ({ event }) => (
    <Flex
      justify="space-between"
      bg="white"
      p={1}
      borderRadius="md"
      boxShadow="md"
      _hover={{ boxShadow: "lg" }}
      width="100%"
    >
      <Text
        fontSize="sm"
        fontWeight="bold"
        color="teal"
        maxWidth="60px"
        whiteSpace="normal"
      >
        {event.title}
      </Text>

      <Stack direction="column" spacing={1}>
        <Button
          colorScheme="teal"
          size="xs"
          variant="outline"
          onClick={() => handleEdit(event)}
        >
          Edit
        </Button>
        <Button
          colorScheme="red"
          size="xs"
          variant="outline"
          onClick={() => handleDeleteItem(event)}
        >
          Delete
        </Button>
      </Stack>
    </Flex>
  );

  return (
    <Box padding="1rem" maxW="1200px" mx="auto">
      <Heading as="h1" size="xl" mb="10" textAlign="center">
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
        style={{ height: 600 }}
        eventPropGetter={eventPropGetter}
        components={{ event: Event }}
      />
      <TaskModal
        isOpen={isOpen}
        onClose={handleClose}
        editData={selectedTask}
        employees={employees}
        handleSubmit={handleSubmit}
        actionType={actionType}
      />
    </Box>
  );
};

export default EmployeeManagement;
