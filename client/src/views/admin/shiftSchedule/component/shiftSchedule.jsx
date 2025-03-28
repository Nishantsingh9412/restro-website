import { Fragment, useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  useDisclosure,
  Button,
  FormLabel,
  FormControl,
  Input,
  Select,
  Textarea,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { getEmployeeApi } from "../../../../redux/action/employee";
import {
  deleteShiftApi,
  getShiftByEmpl,
  postShiftApi,
} from "../../../../redux/action/shift";
import { useToast } from "../../../../contexts/useToast";
// Define view modes and time slots
const views = ["Daily", "Weekly", "Monthly"];
const times = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

// Function to get days to display based on the selected view mode
const getDaysToDisplay = (view, date) => {
  const currentDate = new Date(date);

  switch (view) {
    case "Weekly":
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(currentDate); // Create a new date object for each iteration
        return new Date(
          day.setDate(currentDate.getDate() - currentDate.getDay() + i)
        );
      });
    case "Monthly": {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      return Array.from(
        {
          length: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          ).getDate(),
        },
        (_, i) =>
          new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), i + 1)
      );
    }
    default:
      return [new Date(currentDate)]; // Return a copy of the currentDate
  }
};

const ShiftScheduleComponent = () => {
  // Modal state management
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const dispatch = useDispatch();

  // Initial form state
  const initialFormState = {
    _id: "",
    from: "",
    to: "",
    note: "",
    employeeId: null,
    date: "",
  };

  // Component state management
  const [employee, setEmployee] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewIndex, setViewIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [shiftData, setShiftData] = useState(initialFormState);
  const showToast = useToast();

  // Fetch data from APIs
  const fetchData = async () => {
    const empRes = await dispatch(getEmployeeApi());
    const shiftRes = await dispatch(getShiftByEmpl());
    if (empRes.success) setEmployee(empRes.data);
    if (shiftRes.success) setEmployee(shiftRes.data);
    setIsLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  // Handle modal close
  const handleModalClose = () => {
    setShiftData(initialFormState);
    onModalClose();
  };

  // Handle shift add/edit action
  const handleShiftAction = async () => {
    const fromTime = new Date(`1970-01-01T${shiftData.from}:00`);
    const toTime = new Date(`1970-01-01T${shiftData.to}:00`);
    const timeDifference = (toTime - fromTime) / (1000 * 60 * 60); // Difference in hours

    if (timeDifference < 1) {
      showToast("The shift duration must be at least 1 hour.", "error");
    }
    const { date, employeeId, from, to, _id } = shiftData;
    if (!date || !employeeId || !from || !to)
      return showToast("All fields are required", "error");

    const res = await dispatch(postShiftApi(shiftData, _id));

    handleModalClose();
    if (res.success) {
      fetchData();
      showToast(
        _id ? "Shift updated successfully" : "Shift added successfully",
        "success"
      );
    } else {
      showToast(res.message, "error");
    }
  };

  // Handle shift delete action
  const handleDeleteShift = async () => {
    // if (!shiftData._id) return showToast("Shift not found");
    if (!shiftData._id) return showToast("Shift not found", "error");
    const res = await dispatch(deleteShiftApi({ _id: shiftData._id }));
    handleModalClose();
    res.success &&
      showToast("Shift deleted successfully", "success") &&
      fetchData();
  };

  // Get days to display based on the current view mode and date
  const daysToDisplay = getDaysToDisplay(views[viewIndex], currentDate);

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Fragment>
      {/* Date selection and view mode controls */}
      <Box overflow="auto" whiteSpace="nowrap" mt={16} mb={8}>
        <HStack justifyContent="center" mb={4}>
          <Input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            padding={2}
            borderRadius={5}
            border="1px solid gray"
            cursor="pointer"
          />
          <span>to</span>
          <Input
            disabled
            type="date"
            value={daysToDisplay.slice(-1)[0].toISOString().split("T")[0]}
            padding={2}
            borderRadius={5}
            cursor="not-allowed"
            bg="lightgray"
            border="1px solid gray"
          />
        </HStack>

        <HStack justifyContent="center" mb={4}>
          <Button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate).setDate(
                  new Date(currentDate).getDate() -
                    (views[viewIndex] === "Daily"
                      ? 1
                      : views[viewIndex] === "Weekly"
                      ? 7
                      : 30)
                )
              )
            }
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setViewIndex((viewIndex + views.length - 1) % views.length)
            }
          >
            View Mode: {views[viewIndex]}
          </Button>
          <Button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate).setDate(
                  new Date(currentDate).getDate() +
                    (views[viewIndex] === "Daily"
                      ? 1
                      : views[viewIndex] === "Weekly"
                      ? 7
                      : 30)
                )
              )
            }
          >
            Next
          </Button>
        </HStack>

        {/* Shift schedule table */}
        <TableContainer bg="white" p={4} borderRadius="8px" boxShadow="md">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th border="1px solid #000000" fontWeight="800" fontSize="14px">
                  Employee Name
                </Th>
                {daysToDisplay.map((day, idx) => (
                  <Th
                    key={idx}
                    border="1px solid #000000"
                    fontWeight="800"
                    fontSize="14px"
                  >
                    {day.toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {employee.length ? (
                employee.map((emp) => (
                  <Tr key={emp._id}>
                    <Td
                      border="1px solid #ababab"
                      fontWeight="800"
                      fontSize="14px"
                    >
                      {emp.name}
                    </Td>
                    {daysToDisplay.map((day, idx) => {
                      const shift = emp.shifts?.find(
                        (sh) =>
                          new Date(sh.date).toLocaleDateString() ===
                          day.toLocaleDateString()
                      );
                      const isDateValid =
                        new Date(day) >
                        new Date(new Date().setDate(new Date().getDate() + 1));
                      return (
                        <Td
                          key={idx}
                          textAlign="center"
                          border="1px solid #ababab"
                          fontWeight="800"
                          fontSize="14px"
                          _hover={{ bg: "gray.200" }}
                        >
                          {shift ? (
                            <>
                              {`${new Date(shift.from).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "UTC",
                              })} - ${new Date(shift.to).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "UTC",
                                }
                              )}`}
                              &nbsp; &nbsp;
                              <EditIcon
                                mb={"4px"}
                                cursor={isDateValid ? "pointer" : "not-allowed"}
                                onClick={() => {
                                  if (isDateValid) {
                                    const fromTime = new Date(shift.from)
                                      .toISOString()
                                      .slice(11, 16); // Extract time in "HH:MM" format
                                    const toTime = new Date(shift.to)
                                      .toISOString()
                                      .slice(11, 16); // Extract time in "HH:MM" format
                                    setShiftData({
                                      _id: shift._id,
                                      from: fromTime,
                                      to: toTime,
                                      note: shift.note,
                                      employeeId: emp._id,
                                      date: day.toISOString().split("T")[0],
                                    });
                                    onModalOpen();
                                  } else {
                                    showToast(
                                      "Cannot edit shift for past dates or within 24 hours.",
                                      "error"
                                    );
                                  }
                                }}
                              />
                            </>
                          ) : (
                            <AddIcon
                              cursor={isDateValid ? "pointer" : "not-allowed"}
                              onClick={() => {
                                if (isDateValid) {
                                  setShiftData({
                                    employeeId: emp._id,
                                    date: day.toISOString().split("T")[0],
                                  });
                                  onModalOpen();
                                } else {
                                  showToast(
                                    "Cannot add shift for past dates or within 24 hours.",
                                    "error"
                                  );
                                }
                              }}
                            />
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={daysToDisplay.length + 1}>No employees found</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal for adding/editing shifts */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{shiftData._id ? "Edit" : "Add"} Shift</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Employee</FormLabel>
              <Select
                disabled={true}
                value={shiftData.employeeId || ""}
                onChange={(e) =>
                  setShiftData({
                    ...shiftData,
                    employeeId: e.target.value,
                  })
                }
              >
                <option value="">Select Employee</option>
                {employee.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={shiftData.date || ""}
                onChange={(e) =>
                  setShiftData({
                    ...shiftData,
                    date: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>From Time</FormLabel>
              <Select
                value={shiftData.from || ""}
                onChange={(e) =>
                  setShiftData({
                    ...shiftData,
                    from: e.target.value,
                  })
                }
              >
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>To Time</FormLabel>
              <Select
                value={shiftData.to || ""}
                onChange={(e) =>
                  setShiftData({ ...shiftData, to: e.target.value })
                }
              >
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Note</FormLabel>
              <Textarea
                value={shiftData.note}
                onChange={(e) =>
                  setShiftData({ ...shiftData, note: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleShiftAction}>
              {shiftData._id ? "Update" : "Add"}
            </Button>
            <Button colorScheme="gray" mr={3} onClick={handleModalClose}>
              Cancel
            </Button>
            {shiftData._id && (
              <Button colorScheme="red" onClick={handleDeleteShift}>
                Delete
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ShiftScheduleComponent;
