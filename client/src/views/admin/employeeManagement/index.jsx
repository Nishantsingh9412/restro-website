import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
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
    useDisclosure
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
    AllEmployeesAPI,
    updateTaskAPI,
    assignTaskAPI,
    getAllTasksAPI,
    deleteTaskAPI
} from '../../../api/index.js';
import UpdateTask from './components/UpdateTask.jsx';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const EmployeeManagement = () => {
    const [events, setEvents] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { isOpen: isUpdateOpen, onOpen: isUpdateOnOpen, onClose: isUpdateOnClose } = useDisclosure();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [taskDetails, setTaskDetails] = useState({
        title: '',
        description: '',
        assignedTo: '',
        startDate: new Date(),
        endDate: new Date()
    });
    const [employees, setEmployees] = useState([]);

    const localUser = JSON.parse(localStorage.getItem('ProfileData'));
    const localUserId = localUser?.result?._id;

    useEffect(() => {
        // Fetch tasks and transform them into calendar events
        getAllTasksAPI().then((response) => {
            const tasks = response?.data?.result.map((task) => ({
                title: task.title,
                start: new Date(task.startDate),
                end: new Date(task.endDate),
                id: task._id,
            }));
            setEvents(tasks);
        }).catch((err) => {
            console.log('Error from get all tasks API:');
            console.log(err);
        });

        // Fetch employees
        AllEmployeesAPI().then((response) => {
            setEmployees(response?.data?.result);
        }).catch((err) => {
            console.log('Error from get all employees API:');
            console.log(err);
        });
    }, []);

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setIsOpen(true);
        setTaskDetails({
            ...taskDetails,
            startDate: slotInfo.start,
            endDate: slotInfo.end
        });
    };

    const handleEventDrop = ({ event, start, end }) => {
        const updatedEvent = { ...event, start, end };
        setEvents((prevEvents) =>
            prevEvents.map((evt) => (evt.id === event.id ? updatedEvent : evt))
        );

        // Update the event in the backend
        updateTaskAPI({
            ...updatedEvent,
            startDate: start,
            endDate: end
        }).then((response) => {
            console.log('Event updated:', response.data);
        }).catch((err) => {
            console.log('Error from update task API:');
            console.log(err);
        });
    };

    const handleSubmit = () => {
        const newTask = {
            title: taskDetails.title,
            description: taskDetails.description,
            assignedTo: taskDetails.assignedTo,
            startDate: taskDetails.startDate,
            endDate: taskDetails.endDate,
            created_by: localUserId,
        };
        assignTaskAPI(newTask).then((response) => {
            const task = response?.data?.result;
            setEvents([...events, {
                title: task.title,
                start: new Date(task.startDate),
                end: new Date(task.endDate),
                id: task._id,
            }]);
            setIsOpen(false);
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleDelete = (event) => {
        deleteTaskAPI(event.id).then(() => {
            setEvents(events.filter((e) => e.id !== event.id));
        }).catch((err) => {
            console.log(err);
        });
    };

    const eventPropGetter = (event, start, end, isSelected) => {
        return {
            style: {
                backgroundColor: isSelected ? '#f50057' : '#3f51b5',
                cursor: 'pointer',
            },
        };
    };

    const Event = ({ event }) => (
        <span>
            <strong>{event.title}</strong>
            <Button colorScheme="green" size="xs"  onClick={() => {
                console.log(event)
                isUpdateOnOpen();
            }}>
                Edit
            </Button>
            <Button colorScheme="red" size="xs" ml={'2'} onClick={() => handleDelete(event)}>
                Delete
            </Button>
        </span>
    );

    return (
        <Box marginTop={'5rem'}>
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
                components={{
                    event: Event,
                }}
            />
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Assign Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input
                                value={taskDetails.title}
                                onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input
                                value={taskDetails.description}
                                onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Assign To</FormLabel>
                            <Select
                                placeholder="Select employee"
                                value={taskDetails.assignedTo}
                                onChange={(e) => setTaskDetails({ ...taskDetails, assignedTo: e.target.value })}
                            >
                                {employees.map((employee) => (
                                    <option key={employee._id} value={employee._id}>{employee.name}</option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Start Date and Time</FormLabel>
                            <DatePicker
                                selected={taskDetails.startDate}
                                onChange={(date) => setTaskDetails({ ...taskDetails, startDate: date })}
                                showTimeSelect
                                dateFormat="Pp"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>End Date and Time</FormLabel>
                            <DatePicker
                                selected={taskDetails.endDate}
                                onChange={(date) => setTaskDetails({ ...taskDetails, endDate: date })}
                                showTimeSelect
                                dateFormat="Pp"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>Assign Task</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <UpdateTask
                isOpen={isUpdateOpen}
                onOpen={isUpdateOnOpen}
                onClose={isUpdateOnClose}
                selectedTask={selectedSlot}
            // taskDetails={taskDetails}
            // setTaskDetails={setTaskDetails}
            // employees={employees}
            // setEvents={setEvents}
            // events={events}
            />
        </Box>
    );
};

export default EmployeeManagement;
