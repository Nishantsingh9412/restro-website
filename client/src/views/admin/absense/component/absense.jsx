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
import { useToast } from "../../../../contexts/useToast";
import {
  deleteAbsenceApi,
  getAbsenceByEmpl,
  postAbsenceApi,
} from "../../../../redux/action/absent";
import { useDispatch } from "react-redux";
import AbsenceModal from "./absenceModal";
import { Spinner } from "@chakra-ui/react";

// Define the different views for the calendar
const views = ["Daily", "Weekly", "Monthly"];

// Function to get a single day
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

// Function to get all days in a week
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

// Function to get all days in a month
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

// Function to get the end date in the calendar based on the view
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
  // State variables
  const [employees, setEmployees] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [editAbsenceId, setEditAbsenceId] = useState("");
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewIndex, setViewIndex] = useState(1);

  // Handle previous button click
  const handlePrev = () => {
    const date = new Date(currentDate);
    const prevs = {
      Daily: new Date(date.setDate(date.getDate() - 1)),
      Weekly: new Date(date.setDate(date.getDate() - 7)),
      Monthly: new Date(date.setMonth(date.getMonth() - 1)),
    };
    setCurrentDate(prevs[views[viewIndex]]);
  };

  // Handle next button click
  const handleNext = () => setCurrentDate(calenderToDate());

  // Convert calendar to date
  const calenderToDate = () => {
    const date = new Date(currentDate);
    const nexts = {
      Daily: new Date(date.setDate(date.getDate() + 1)),
      Weekly: new Date(date.setDate(date.getDate() + 7)),
      Monthly: new Date(date.setMonth(date.getMonth() + 1)),
    };
    return nexts[views[viewIndex]].toISOString().split("T")[0];
  };

  // Handle custom date input
  const handleCustomDate = (event) => {
    const date = event.target.value;
    if (!isNaN(new Date(date).getTime())) setCurrentDate(date);
  };

  // Handle view previous button click
  const handleViewPrev = () =>
    setViewIndex((viewIndex + views.length - 1) % views.length);

  // Determine the days to display based on the view
  const daysToDisplay =
    views[viewIndex] === "Daily"
      ? getDay(new Date(currentDate))
      : views[viewIndex] === "Weekly"
      ? getWeekDays(new Date(currentDate))
      : getMonthDays(new Date(currentDate));

  // Convert date to new format
  const convertDateToNewFormat = (dateString) => {
    const date = new Date(dateString).toISOString().split("T")[0];
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  // API Call to get absence by date
  const getAbsencebyDate = async () => {
    const res = await dispatch(getAbsenceByEmpl());
    if (res.success) setEmployees(res.data);
  };

  // Handle save absence
  const handleSaveAbsence = async (formData) => {
    formData.employeeId = selectedEmployeeId;
    try {
      const res = await dispatch(postAbsenceApi(formData, editAbsenceId));
      if (res.success) {
        toast(
          editAbsenceId
            ? "Absence Updated successfully"
            : "Absence Add successfully",
          "success"
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

  // Handle delete absence
  const deleteAbsence = async () => {
    try {
      if (!editAbsenceId) {
        toast("All fields are required", "error");
        return;
      }
      await dispatch(deleteAbsenceApi({ _id: editAbsenceId }));
      toast("Absence deleted successfully", "success");
      onClose();
      await getAbsencebyDate();
    } catch (err) {
      console.error("Failed to delete employee leave:", err);
    }
  };

  // Fetch absence data on component mount
  useEffect(() => {
    setLoading(true);
    getAbsencebyDate().finally(() => setLoading(false)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle modal close
  const handleClose = () => {
    // Reset modal state when closing
    setSelectedAbsence(null);
    setEditAbsenceId("");
    setSelectedEmployeeId("");
    setActionType("");
    onClose(); // This is the Chakra UI's method to close the modal
  };

  // Show loading spinner if data is being fetched
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

  // Render the component
  return (
    <Fragment>
      {/* Legend for absence types */}
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
                      // Format the current day's date for comparison
                      const formattedDay = new Date(
                        day.date
                      ).toLocaleDateString();

                      // Check if the date is valid to add/edit absence
                      const isDateValid =
                        new Date(day?.date) >
                        new Date(new Date().setDate(new Date().getDate() + 1));

                      // Find absences that cover this particular day
                      const absences = emp.absences.filter((absence) => {
                        const startDate = new Date(
                          absence.startDate
                        ).toLocaleDateString();
                        const endDate = new Date(
                          absence.endDate
                        ).toLocaleDateString();

                        return (
                          formattedDay >= startDate && formattedDay <= endDate
                        );
                      });

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
                          {absences.length > 0 ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              {absences.map((absence) => (
                                <Box
                                  key={absence._id}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  cursor="pointer"
                                  mb={2}
                                >
                                  <StarIcon
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
                                  )} — ${convertDateToNewFormat(
                                    absence.endDate
                                  )}`}
                                  &nbsp; &nbsp;
                                  <EditIcon
                                    cursor={
                                      isDateValid ? "pointer" : "not-allowed"
                                    }
                                    onClick={() => {
                                      if (!isDateValid) {
                                        toast(
                                          "You can't edit absence for past dates or within 24 hours",
                                          "error"
                                        );
                                        return;
                                      }
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
                                    }}
                                  />
                                </Box>
                              ))}
                            </Box>
                          ) : (
                            <AddIcon
                              cursor={isDateValid ? "pointer" : "not-allowed"}
                              onClick={() => {
                                if (isDateValid) {
                                  const date = new Date(day.date);

                                  const year = date.getFullYear(); // Get the full year (e.g., 2024)
                                  const month = String(
                                    date.getMonth() + 1
                                  ).padStart(2, "0"); // Get month (0-11) and pad to 2 digits
                                  const days = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                  ); // Get day of the month (1-31) and pad to 2 digits

                                  // Format as "yyyy-MM-dd"
                                  const formattedDate = `${year}-${month}-${days}`;

                                  setActionType("add");
                                  setSelectedEmployeeId(emp._id);
                                  setSelectedAbsence({
                                    emp_name: emp.name,
                                    startDate: formattedDate,
                                  });
                                  onOpen();
                                } else {
                                  toast(
                                    "You can't add absence for past dates or within 24 hours",
                                    "error"
                                  );
                                }
                              }}
                              className="add_icon_hover"
                              sx={{
                                marginRight: "10px",
                                color: "black",
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

      {/* Absence Modal */}
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
