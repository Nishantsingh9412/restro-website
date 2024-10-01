import { Fragment, useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useDisclosure,
  HStack,
  Input,
  Box,
} from "@chakra-ui/react";
import { AddIcon, StarIcon, EditIcon } from "@chakra-ui/icons";

import { toast } from "react-toastify";
import {
  deleteAbsenceApi,
  getAbsenceByEmpl,
  postAbsenceApi,
} from "../../../../redux/action/absent";
import { useDispatch } from "react-redux";
import AbsenceModal from "./absenceModal";
import { Spinner } from "@chakra-ui/react";

const views = ["Daily", "Weekly", "Monthly"];

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

const getEndDateInCalender = (viewIndex, currentDate) => {
  const cDate = new Date(currentDate);
  if (views[viewIndex] === "Daily") return currentDate;
  if (views[viewIndex] === "Weekly") {
    const startOfWeek = cDate.getDate() - cDate.getDay();
    return new Date(cDate.setDate(startOfWeek + 6)).toISOString().split("T")[0];
  }
  const endOfMonth = new Date(cDate.getFullYear(), cDate.getMonth() + 1, 0);
  return endOfMonth.toISOString().split("T")[0];
};

export default function AbsenseComponent() {
  const [employees, setEmployees] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAbsence, setSelectedAbsence] = useState(null);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [editAbsenceId, setEditAbsenceId] = useState("");
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewIndex, setViewIndex] = useState(1);

  const handlePrev = () => {
    const date = new Date(currentDate);
    const prevs = {
      Daily: new Date(date.setDate(date.getDate() - 1)),
      Weekly: new Date(date.setDate(date.getDate() - 7)),
      Monthly: new Date(date.setMonth(date.getMonth() - 1)),
    };
    setCurrentDate(prevs[views[viewIndex]]);
  };

  const handleNext = () => setCurrentDate(calenderToDate());

  const calenderToDate = () => {
    const date = new Date(currentDate);
    const nexts = {
      Daily: new Date(date.setDate(date.getDate() + 1)),
      Weekly: new Date(date.setDate(date.getDate() + 7)),
      Monthly: new Date(date.setMonth(date.getMonth() + 1)),
    };
    return nexts[views[viewIndex]].toISOString().split("T")[0];
  };

  const handleCustomDate = (event) => {
    const date = event.target.value;
    if (!isNaN(new Date(date).getTime())) setCurrentDate(date);
  };

  const handleViewPrev = () =>
    setViewIndex((viewIndex + views.length - 1) % views.length);
  // const handleViewNext = () => setViewIndex((viewIndex + 1) % views.length);

  const daysToDisplay =
    views[viewIndex] === "Daily"
      ? getDay(new Date(currentDate))
      : views[viewIndex] === "Weekly"
      ? getWeekDays(new Date(currentDate))
      : getMonthDays(new Date(currentDate));

  const convertDateToNewFormat = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  // API Call
  const getAbsencebyDate = async () => {
    const userData = JSON.parse(localStorage.getItem("ProfileData"));
    const res = await dispatch(getAbsenceByEmpl(userData.result._id));
    if (res.success) setEmployees(res.data);
  };

  const handleSaveAbsence = async (formData) => {
    formData.employeeId = selectedEmployeeId;
    try {
      const res = await dispatch(postAbsenceApi(formData, editAbsenceId));
      if (res.success) {
        toast.success(
          editAbsenceId
            ? "Absence Updated successfully"
            : "Absence Add successfully"
        );
        onClose();
        await getAbsencebyDate();
      } else {
        console.error("Failed to add employee leave:", res.message);
      }
    } catch (error) {
      console.error("Failed to add employee leave:", error);
    }
  };

  const deleteAbsence = async () => {
    try {
      if (!editAbsenceId) {
        toast.warning("All fields are required");
        return;
      }
      await dispatch(deleteAbsenceApi({ _id: editAbsenceId }));
      toast.success("Absence Delete successfully");
      onClose();
      await getAbsencebyDate();
    } catch (err) {
      console.error("Failed to delete employee leave:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAbsencebyDate().finally(() => setLoading(false)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    // Reset modal state when closing
    setSelectedAbsence(null);
    setEditAbsenceId("");
    setSelectedEmployeeId("");
    setActionType("");
    onClose(); // This is the Chakra UI's method to close the modal
  };

  if (loading) {
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
      <Box display="flex" justifyContent="center" mb={4}>
        <HStack spacing={4}>
          <Box bg="#00A7C4" height="20px" width="20px" borderRadius="4px"></Box>
          <span>Paid Vacation</span>
          <Box bg="#F8C150" height="20px" width="20px" borderRadius="4px"></Box>
          <span>Sick</span>
          <Box bg="#543EAC" height="20px" width="20px" borderRadius="4px"></Box>
          <span>Special leave</span>
          <Box bg="#FF910A" height="20px" width="20px" borderRadius="4px"></Box>
          <span>Unpaid vacation</span>
        </HStack>
      </Box>
      {/* Calendar */}
      <Box overflow="auto" whiteSpace="nowrap" mt={8}>
        <HStack justifyContent="center" mb={4}>
          <Input
            type="date"
            value={currentDate}
            onChange={handleCustomDate}
            padding={2}
            borderRadius={5}
            border="1px solid gray"
            cursor="pointer"
          />
          <span>to</span>
          <Input
            disabled
            type="date"
            value={getEndDateInCalender(viewIndex, currentDate)}
            padding={2}
            borderRadius={5}
            cursor="not-allowed"
            bg="lightgray"
            border="1px solid gray"
          />
        </HStack>
        <HStack justifyContent="center" mb={4}>
          <Button onClick={handlePrev}>Previous</Button>
          <Button onClick={handleViewPrev}>
            View Mode: {views[viewIndex]}
          </Button>
          {/* <Button onClick={handleViewNext}>Next View</Button> */}
          <Button onClick={handleNext}>Next</Button>
        </HStack>
        <TableContainer bg="white" p={4} borderRadius="8px" boxShadow="md">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th border="1px solid #000000" fontWeight="800" fontSize="14px">
                  Employee Name
                </Th>
                {daysToDisplay.map((day, index) => (
                  <Th
                    key={index}
                    border="1px solid #000000"
                    fontWeight="800"
                    fontSize="14px"
                  >
                    {`${day.day}, ${day.date}`}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {employees && employees.length > 0 ? (
                employees.map((emp) => (
                  <Tr key={emp._id}>
                    <Td
                      fontSize="14px"
                      fontWeight="600"
                      border="1px solid #c5bcbc"
                    >
                      {emp.name}
                    </Td>
                    {daysToDisplay.map((day, index) => {
                      const absence = emp.absences.find(
                        (ab) =>
                          new Date(ab.startDate).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }) === day.date
                      );
                      return (
                        <Td
                          key={index}
                          fontSize="14px"
                          fontWeight="800"
                          textAlign="center"
                          border="1px solid #c5bcbc"
                          className="add_hover"
                          _hover={{ bg: "gray.200" }}
                        >
                          {absence ? (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              // onClick={() => handleEditOrDelete(absence)}
                              cursor="pointer"
                            >
                              <StarIcon
                                mb={3}
                                color={
                                  absence.type === "Paid vacation"
                                    ? "#00A7C4"
                                    : absence.type === "Sick leave"
                                    ? "#f8c150"
                                    : absence.type === "Special leave"
                                    ? "#543eac"
                                    : absence.type === "Unpaid vacation"
                                    ? "#ff910a"
                                    : ""
                                }
                              />
                              &nbsp;
                              {`${convertDateToNewFormat(
                                absence.startDate
                              )} - ${convertDateToNewFormat(absence.endDate)}`}
                              &nbsp; &nbsp;
                              <EditIcon
                                onClick={() => {
                                  setSelectedEmployeeId(emp._id);
                                  setEditAbsenceId(absence._id);
                                  setSelectedAbsence({
                                    ...absence,
                                    emp_name: emp.name,
                                  });
                                  setActionType("edit");

                                  onOpen();
                                }}
                                className="edit_icon_hover"
                                sx={{
                                  marginRight: "10px",
                                  color: "black",
                                  cursor: "pointer",
                                }}
                              />
                            </Box>
                          ) : (
                            <AddIcon
                              onClick={() => {
                                const date = new Date(day.date);
                                date.setFullYear(
                                  new Date(currentDate).getFullYear()
                                );
                                const [_month, _day, _year] = date
                                  .toLocaleDateString()
                                  .split("/");
                                const formattedStartDate = `${_year}-${_month.padStart(
                                  2,
                                  "0"
                                )}-${_day.padStart(2, "0")}`;
                                setActionType("add");
                                setSelectedEmployeeId(emp._id);
                                setSelectedAbsence({
                                  emp_name: emp.name,
                                  startDate: formattedStartDate,
                                });
                                onOpen();
                              }}
                              className="add_icon_hover"
                              sx={{
                                marginRight: "10px",
                                color: "black",
                                cursor: "pointer",
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
                  <Td colSpan={daysToDisplay.length + 1} textAlign="center">
                    No employees found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <AbsenceModal
        onClose={handleClose}
        isOpen={isOpen}
        actionType={actionType}
        leaveData={selectedAbsence}
        handleSubmit={handleSaveAbsence}
        deleteLeaveRequest={deleteAbsence}
      />
    </Fragment>
  );
}
