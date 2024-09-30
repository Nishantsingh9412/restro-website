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
import { AddIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { Spinner } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { getEmployeeApi } from "../../../../redux/action/employee";
import {
  deleteShiftApi,
  getShiftByEmpl,
  postShiftApi,
} from "../../../../redux/action/shift";

const views = ["daily", "weekly", "monthly"];
const times = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

const getDaysToDisplay = (view, date) => {
  const currentDate = new Date(date);
  switch (view) {
    case "weekly":
      return Array.from(
        { length: 7 },
        (_, i) =>
          new Date(
            currentDate.setDate(
              currentDate.getDate() - currentDate.getDay() + i
            )
          )
      );
    case "monthly": {
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
        (_, i) => new Date(startOfMonth.setDate(i + 1))
      );
    }
    default:
      return [currentDate];
  }
};

const ShiftScheduleComponent = () => {
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const dispatch = useDispatch();

  const [employee, setEmployee] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewIndex, setViewIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [shiftEditData, setShiftEditData] = useState({
    shiftEditId: "",
    fromTime: "",
    toTime: "",
    note: "",
    selectedEmployeeId: null,
    startDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem("ProfileData"));
      const empRes = await dispatch(getEmployeeApi(userData.result._id));
      const shiftRes = await dispatch(getShiftByEmpl(userData.result._id));
      if (empRes.success) setEmployee(empRes.data);
      if (shiftRes.success) setEmployee(shiftRes.data);
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const handleModalClose = () => {
    setShiftEditData({
      shiftEditId: "",
      fromTime: "",
      toTime: "",
      note: "",
      selectedEmployeeId: null,
      startDate: "",
    });
    onAddModalClose();
  };

  const handleShiftAction = async () => {
    const {
      startDate,
      selectedEmployeeId,
      fromTime,
      toTime,
      note,
      shiftEditId,
    } = shiftEditData;
    if (!startDate || !selectedEmployeeId || !fromTime || !toTime)
      return toast.error("All fields are required");

    const shiftData = {
      date: new Date(startDate).toISOString(),
      employeeId: selectedEmployeeId,
      from: fromTime,
      to: toTime,
      note,
    };
    const res = await dispatch(postShiftApi(shiftData, shiftEditId));
    handleModalClose();
    res.success
      ? toast.success("Shift added successfully")
      : toast.error("Shift action failed");
  };

  const handleDeleteShift = async () => {
    if (!shiftEditData.shiftEditId) return toast.error("Shift not found");
    const res = await dispatch(
      deleteShiftApi({ _id: shiftEditData.shiftEditId })
    );
    handleModalClose();
    res.success && toast.success("Shift deleted successfully");
  };

  const daysToDisplay = getDaysToDisplay(views[viewIndex], currentDate);
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
                    (views[viewIndex] === "daily"
                      ? 1
                      : views[viewIndex] === "weekly"
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
          {/* <Button onClick={() => setViewIndex((viewIndex + 1) % views.length)}>
            Next View
          </Button> */}
          <Button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate).setDate(
                  new Date(currentDate).getDate() +
                    (views[viewIndex] === "daily"
                      ? 1
                      : views[viewIndex] === "weekly"
                      ? 7
                      : 30)
                )
              )
            }
          >
            Next
          </Button>
        </HStack>
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
                      return (
                        <Td
                          key={idx}
                          textAlign="center"
                          border="1px solid #ababab"
                          fontWeight="800"
                          fontSize="14px"
                          onClick={() =>
                            shift
                              ? setShiftEditData({
                                  ...shiftEditData,
                                  ...shift,
                                  selectedEmployeeId: emp._id,
                                  startDate: day.toISOString().split("T")[0],
                                })
                              : onAddModalOpen()
                          }
                        >
                          {shift ? (
                            `${new Date(shift.from).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} - ${new Date(shift.to).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
`
                          ) : (
                            <AddIcon />
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

      <Modal isOpen={isAddModalOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {shiftEditData.shiftEditId ? "Edit" : "Add"} Shift
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Employee</FormLabel>
              <Select
                value={shiftEditData.selectedEmployeeId || ""}
                onChange={(e) =>
                  setShiftEditData({
                    ...shiftEditData,
                    selectedEmployeeId: e.target.value,
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
                value={shiftEditData.startDate || ""}
                onChange={(e) =>
                  setShiftEditData({
                    ...shiftEditData,
                    startDate: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>From Time</FormLabel>
              <Select
                value={shiftEditData.fromTime || ""}
                onChange={(e) =>
                  setShiftEditData({
                    ...shiftEditData,
                    fromTime: e.target.value,
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
                value={shiftEditData.toTime || ""}
                onChange={(e) =>
                  setShiftEditData({ ...shiftEditData, toTime: e.target.value })
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
                value={shiftEditData.note}
                onChange={(e) =>
                  setShiftEditData({ ...shiftEditData, note: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleShiftAction}>
              {shiftEditData.shiftEditId ? "Update" : "Add"}
            </Button>
            <Button colorScheme="red" onClick={handleDeleteShift}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ShiftScheduleComponent;
