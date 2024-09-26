import React, { Fragment, useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import {
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
import { useDispatch } from "react-redux";
import { getEmployeeApi } from "../../../../redux/action/employee";
import {
  deleteShiftApi,
  getShiftByEmpl,
  postShiftApi,
} from "../../../../redux/action/shift";

const getEndDateInCalender = (viewIndex, currentDate) => {
  if (views[viewIndex] === "daily") return currentDate;
  else if (views[viewIndex] === "weekly") {
    const cDate = new Date(currentDate);
    const startOfWeek = cDate.getDate() - cDate.getDay();
    return new Date(cDate.setDate(startOfWeek + 6)).toISOString().split("T")[0];
  } else {
    const cDate = new Date(currentDate);
    const endOfMonth = new Date(cDate.getFullYear(), cDate.getMonth() + 1, 0);
    return endOfMonth.toISOString().split("T")[0];
  }
};

const getDay = (date) => [
  {
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  },
];

const times = Array.from({ length: 24 }, (_, i) => {
  const time = i.toString().padStart(2, "0");
  return `${time}:00`;
});

const views = ["daily", "weekly", "monthly"];

/*
function getWeekInfo(date) {
		const givenDate = new Date(date);
		const dayOfWeek = givenDate.getDay();
		const startOfWeek = new Date(givenDate);
		startOfWeek.setDate(givenDate.getDate() - dayOfWeek);
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);
		const daysOfWeek = [];
		for (let i = 0; i < 7; i++) {
				const day = new Date(startOfWeek);
				day.setDate(startOfWeek.getDate() + i);
				daysOfWeek.push(day.toISOString().split('T')[0]);
		}

		return {
				startOfWeek: startOfWeek.toISOString().split('T')[0],
				endOfWeek: endOfWeek.toISOString().split('T')[0],
				daysOfWeek: daysOfWeek
		};
}
*/

const getWeekDays = (date) => {
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return {
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      date: day.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  });
};

const getMonthDays = (date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days = [];
  for (
    let day = startOfMonth;
    day <= endOfMonth;
    day.setDate(day.getDate() + 1)
  ) {
    days.push({
      day: new Date(day).toLocaleDateString("en-US", { weekday: "short" }),
      date: new Date(day).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
  }
  return days;
};

const convertDateToTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const ShiftScheduleComponent = () => {
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState("");
  const [employee, setEmployee] = useState([]);

  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [note, setNote] = useState("");
  const [shiftEditId, setShiftEditId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewIndex, setViewIndex] = useState(1); // Default to weekly view

  const handleAddEditCloseModal = () => {
    setShiftEditId("");
    setFromTime("");
    setToTime("");
    setNote("");
    setSelectedEmployeeId(null);
    getShiftbyDate();
    onAddModalClose();
  };

  useEffect(() => {
    getEmployee();
    getShiftbyDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEmployee = async () => {
    const userData = JSON.parse(localStorage.getItem("ProfileData"));
    const res = await dispatch(getEmployeeApi(userData.result._id));
    if (res.success) setEmployee(res.data);
  };

  const deleteShift = async () => {
    if (!shiftEditId) {
      toast.error("Shift not found");
      return;
    }

    const res = await dispatch(deleteShiftApi({ _id: shiftEditId }));
    handleAddEditCloseModal();
    if (res.success) {
      toast.success("Shift deleted successfully");
    } else {
      console.error("Failed to delete employee shift:", res.message);
    }
  };

  const postShift = async () => {
    if (!startDate || !selectedEmployeeId || !fromTime || !toTime) {
      toast.error("All fields are required");
      return;
    }

    const shiftData = {
      date: new Date(startDate).toISOString(),
      employeeId: selectedEmployeeId,
      from: fromTime,
      to: toTime,
      note: note,
    };
    const res = await dispatch(postShiftApi(shiftData, shiftEditId));
    handleAddEditCloseModal();

    if (res.success) {
      toast.success("Shift added successfully");
    }
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);

  const handlePrev = () => {
    const date = new Date(currentDate);
    const prevs = {
      daily: new Date(date.setDate(date.getDate() - 1)),
      weekly: new Date(date.setDate(date.getDate() - 7)),
      monthly: new Date(date.setMonth(date.getMonth() - 1)),
    };
    setCurrentDate(prevs[views[viewIndex]]);
  };

  const calenderToDate = () => {
    const date = new Date(currentDate);
    const nexts = {
      daily: new Date(date.setDate(date.getDate() + 1)),
      weekly: new Date(date.setDate(date.getDate() + 7)),
      monthly: new Date(date.setMonth(date.getMonth() + 1)),
    };
    return nexts[views[viewIndex]].toISOString().split("T")[0];
  };

  const handleNext = () => setCurrentDate(calenderToDate());

  const handleViewPrev = () =>
    setViewIndex((viewIndex + views.length - 1) % views.length);
  const handleViewNext = () => setViewIndex((viewIndex + 1) % views.length);

  const daysToDisplay =
    views[viewIndex] === "daily"
      ? getDay(new Date(currentDate))
      : views[viewIndex] === "weekly"
      ? getWeekDays(new Date(currentDate))
      : getMonthDays(new Date(currentDate));

  const getShiftbyDate = async () => {
    const userData = JSON.parse(localStorage.getItem("ProfileData"));
    const res = await dispatch(getShiftByEmpl(userData.result._id));
    if (res.success) setEmployee(res.data);
  };

  const handleClickEditShift = (shift) => {
    if (!shift) {
      toast.error("Shift not found");
      return;
    }

    setShiftEditId(shift._id);
    setFromTime(convertDateToTime(shift.from));
    setToTime(convertDateToTime(shift.to));
    setNote(shift.note);
    setSelectedEmployeeId(shift.employeeId);
    onAddModalOpen();
  };

  const handleCustomDate = (event) => {
    const date = event.target.value;
    if (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)))
      setCurrentDate(date);
  };

  return (
    <Fragment>
      <Box overflow="auto" whiteSpace="nowrap">
        <HStack justifyContent="center" marginTop={16} marginBottom={8}>
          <Input
            type="date"
            value={currentDate}
            onChange={handleCustomDate}
            style={{
              padding: 5,
              borderRadius: 5,
              border: "1px solid gray",
              cursor: "pointer",
              width: "200px",
            }}
          />
          <span>to</span>
          <Input
            disabled
            type="date"
            value={getEndDateInCalender(viewIndex, currentDate)}
            style={{
              padding: 5,
              borderRadius: 5,
              cursor: "not-allowed",
              background: "lightgray",
              border: "1px solid gray",
              width: "200px",
            }}
          />
        </HStack>

        <HStack justifyContent="center" mb={4}>
          <Button onClick={handlePrev}>Previous</Button>
          <Button onClick={handleViewPrev}>View: {views[viewIndex]}</Button>
          <Button onClick={handleViewNext}>Next View</Button>
          <Button onClick={handleNext}>Next</Button>
        </HStack>

        <TableContainer style={{ backgroundColor: "white", padding: "10px" }}>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th
                  style={{
                    border: "solid 1px #c5bcbc",
                    fontWeight: "800",
                    fontSize: "14px",
                  }}
                >
                  Employee Name
                </Th>
                {daysToDisplay.map((day, index) => (
                  <Th
                    key={index}
                    style={{
                      border: "solid 1px #c5bcbc",
                      fontWeight: "800",
                      fontSize: "14px",
                    }}
                  >{`${day.day}, ${day.date}`}</Th>
                ))}
              </Tr>
            </Thead>

            <Tbody style={{ border: "solid 1px #c5bcbc" }}>
              {employee.length > 0 ? (
                employee.map((emp) => (
                  <Tr key={emp._id}>
                    <Td style={{ border: "solid 1px #c5bcbc" }}>{emp.name}</Td>

                    {daysToDisplay.map((day, index) => {
                      // const shift = emp.shifts?.find(
                      // 	(shift) =>
                      // 		convertDateToNewFormat(shift.date) ===
                      // 		addCurrentYearToDate(day.date),
                      // );
                      const shift = emp.shifts?.find(
                        (sh) =>
                          new Date(sh.date).toLocaleDateString("en-Us", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }) === day.date
                      );

                      return (
                        <Td
                          key={index}
                          className="add_hover"
                          onClick={() =>
                            shift ? handleClickEditShift(shift) : {}
                          }
                          style={{
                            border: "solid 1px #c5bcbc",
                            textAlign: "center",
                          }}
                        >
                          {shift ? (
                            `${convertDateToTime(
                              shift.from
                            )} - ${convertDateToTime(shift.to)}`
                          ) : (
                            <AddIcon
                              className="add_icon_hover"
                              sx={{ marginRight: "10px", color: "black" }}
                              onClick={() => {
                                setSelectedEmployeeId(emp._id);
                                const date = new Date(day.date);
                                date.setFullYear(
                                  new Date(currentDate).getFullYear()
                                );
                                const [_month, _day, _year] = date
                                  .toLocaleDateString()
                                  .split("/");
                                setStartDate(
                                  `${_year}-${_month.padStart(
                                    2,
                                    "0"
                                  )}-${_day.padStart(2, "0")}`
                                );
                                // setStartDate(addCurrentYearToDate(day.date));
                                onAddModalOpen();
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

      <Modal
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        onCloseComplete={handleAddEditCloseModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Shift</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isDisabled>
              <FormLabel>Employee</FormLabel>
              <Select
                value={selectedEmployeeId || ""}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                defaultValue={selectedEmployeeId || ""}
              >
                <option value="">Select Employee</option>
                {employee?.map((emp) => (
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
                value={startDate || ""}
                onChange={handleStartDateChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>From Time</FormLabel>
              <Select
                placeholder="Select from time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                defaultValue={fromTime}
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
                placeholder="Select to time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                defaultValue={toTime}
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
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add note"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {shiftEditId ? (
              <Button onClick={deleteShift} colorScheme="red" mr={3}>
                Delete
              </Button>
            ) : null}

            <Button onClick={postShift} colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onAddModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ShiftScheduleComponent;
