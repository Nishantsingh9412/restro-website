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
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Box,
} from "@chakra-ui/react";
import { AddIcon, StarIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { toast } from "react-toastify";
import {
  deleteAbsenceApi,
  getAbsenceByEmpl,
  postAbsenceApi,
} from "../../../../redux/action/absent";
import { useDispatch } from "react-redux";

const views = ["daily", "weekly", "monthly"];

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

export default function AbsenseComponent() {
  const [employee, setEmployee] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [editAbsenceId, setEditAbsenceId] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [notes, setNotes] = useState("");
  const [vacationType, setVacationType] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getAbsencebyDate(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAbsencebyDate = async () => {
    const userData = JSON.parse(localStorage.getItem("ProfileData"));
    const res = await dispatch(getAbsenceByEmpl(userData.result._id));
    if (res.success) setEmployee(res.data);
  };

  const closeAddAbsenceModal = () => {
    setEditAbsenceId(false);
    getAbsencebyDate();
    setStartDate("");
    setEndDate("");
    setLeaveType("");
    setNotes("");
    setVacationType("");
    setSelectedEmployeeId(null);
    onClose();
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleNotesChange = (e) => setNotes(e.target.value);

  const deleteAbsence = async () => {
    try {
      if (!editAbsenceId) {
        toast.warning("All fields are required");
        return;
      }

      await dispatch(deleteAbsenceApi({ _id: editAbsenceId }));
      toast.success("Absence Delete successfully");
      closeAddAbsenceModal();
    } catch (err) {
      console.error("Failed to delete employee leave:", err);
    }
  };

  const handleSaveAbsence = async () => {
    if (
      !selectedEmployeeId ||
      !vacationType ||
      !startDate ||
      !endDate ||
      !leaveType ||
      !notes
    ) {
      toast.warning("All fields are required");
      return;
    }

    try {
      const data = {
        _id: editAbsenceId
          ? employee?.find((e) => e._id === selectedEmployeeId).absences[0]._id
          : null,
        employeeId: selectedEmployeeId,
        type: vacationType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        leaveType: leaveType,
        notes: notes,
        declineAssignedShifts: true,
      };

      const res = await dispatch(postAbsenceApi(data, editAbsenceId));
      closeAddAbsenceModal();
      if (res.success) {
        toast.success(
          editAbsenceId
            ? "Absence Delete successfully"
            : "Absence Add successfully"
        );
      } else {
        console.error("Failed to add employee leave:", res.message);
      }
    } catch (error) {
      console.error("Failed to add employee leave:", error);
    }
  };

  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewIndex, setViewIndex] = useState(1);

  const handlePrev = () => {
    const date = new Date(currentDate);
    const prevs = {
      daily: new Date(date.setDate(date.getDate() - 1)),
      weekly: new Date(date.setDate(date.getDate() - 7)),
      monthly: new Date(date.setMonth(date.getMonth() - 1)),
    };
    setCurrentDate(prevs[views[viewIndex]]);
  };

  const handleNext = () => setCurrentDate(calenderToDate());

  const calenderToDate = () => {
    const date = new Date(currentDate);
    const nexts = {
      daily: new Date(date.setDate(date.getDate() + 1)),
      weekly: new Date(date.setDate(date.getDate() + 7)),
      monthly: new Date(date.setMonth(date.getMonth() + 1)),
    };
    return nexts[views[viewIndex]].toISOString().split("T")[0];
  };

  const handleCustomDate = (event) => {
    const date = event.target.value;
    if (!isNaN(new Date(date).getTime())) setCurrentDate(date);
  };

  const handleViewPrev = () =>
    setViewIndex((viewIndex + views.length - 1) % views.length);
  const handleViewNext = () => setViewIndex((viewIndex + 1) % views.length);

  const daysToDisplay =
    views[viewIndex] === "daily"
      ? getDay(new Date(currentDate))
      : views[viewIndex] === "weekly"
      ? getWeekDays(new Date(currentDate))
      : getMonthDays(new Date(currentDate));

  const convertDateToNewFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleEditOrDelete = (absence) => {
    setEditAbsenceId(absence._id);
    setSelectedEmployeeId(absence.employeeId);
    setStartDate(absence.startDate.split("T")[0]);
    setEndDate(absence.endDate.split("T")[0]);
    setVacationType(absence.type);
    setLeaveType(absence.leaveType);
    setNotes(absence.notes);
    onOpen();
  };

  return (
    <Fragment>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="paid_vacation_box"
          style={{
            backgroundColor: "#00A7C4",
            height: "20px",
            width: "20px",
            margin: "0 10px",
          }}
        ></div>
        <span>Paid Vacation</span>
        <div
          className="paid_vacation_box"
          style={{
            backgroundColor: "#F8C150",
            height: "20px",
            width: "20px",
            margin: "0 10px",
          }}
        ></div>
        <span>Sick</span>
        <div
          className="paid_vacation_box"
          style={{
            backgroundColor: "#543EAC",
            height: "20px",
            width: "20px",
            margin: "0 10px",
          }}
        ></div>
        <span>Special leave</span>
        <div
          className="paid_vacation_box"
          style={{
            backgroundColor: "#FF910A",
            height: "20px",
            width: "20px",
            margin: "0 10px",
          }}
        ></div>
        <span>Unpaid vacation</span>
      </div>

      {/* {/ {/ **** absent modal box ***** /} /} */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onCloseComplete={closeAddAbsenceModal}
      >
        <ModalOverlay />
        <ModalContent maxWidth="40%">
          <ModalHeader
            sx={{
              backgroundColor: "#00a7c4",
              color: "white",
              textAlign: "center",
              borderTopRadius: "8px",
            }}
          >
            {editAbsenceId ? "Edit assignment" : "Create new assignment"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <FormControl>
              <FormLabel width="100px">Employee</FormLabel>
              <Input
                placeholder={
                  employee && employee.length > 0
                    ? employee.find((e) => e._id === selectedEmployeeId)
                        ?.name || ""
                    : ""
                }
                isDisabled
              />
            </FormControl>

            <FormControl>
              <FormLabel width="200px">Vacation Type</FormLabel>
              <Select
                placeholder="Select option"
                onChange={(e) => setVacationType(e.target.value)}
                defaultValue={vacationType}
              >
                <option value="Paid vacation">Paid Vacation</option>
                <option value="Sick leave">Sick</option>
                <option value="Special leave">Special Leave</option>
                <option value="Unpaid vacation">Unpaid Vacation</option>
              </Select>
            </FormControl>

            <HStack spacing={4} mt={4}>
              <FormLabel width="100px">Duration</FormLabel>
              <div>
                <label>
                  Start Date:
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  End Date:
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                </label>
              </div>
            </HStack>

            <HStack>
              <FormControl>
                <FormLabel width="100px">Leave Type</FormLabel>
                <Select
                  defaultValue={leaveType}
                  placeholder="Select option"
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="All day">All Day</option>
                  <option value="First half">First Half of the Day</option>
                  <option value="Second half">Second Half of the Day</option>
                </Select>
              </FormControl>
            </HStack>

            <FormControl mt={4}>
              <FormLabel>Notes</FormLabel>
              <Textarea
                placeholder="Here is a sample placeholder"
                onChange={handleNotesChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {editAbsenceId ? (
              <Button
                mr={3}
                colorScheme="red"
                onClick={deleteAbsence}
                sx={{ color: "white", borderRadius: "8px" }}
              >
                Delete
              </Button>
            ) : null}

            <Button
              mr={3}
              colorScheme="gray"
              onClick={onClose}
              sx={{ borderRadius: "8px" }}
            >
              Cancel
            </Button>

            <Button
              mr={3}
              colorScheme="teal"
              onClick={handleSaveAbsence}
              sx={{ borderRadius: "8px", color: "white" }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* {/ {/ ****** detail modal box ****** /} /} */}
      {/* <Modal isOpen={isOpenDetails} onClose={onCloseDetails}>
				<ModalOverlay />
				<ModalContent maxWidth='70%'>
					<ModalHeader>Employee Absence Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{absenceDetails.length !== 0 ? (
							<TableContainer>
								<Table variant='simple'>
									<Thead>
										<Tr>
											<Th>Type</Th>
											<Th>Start Date</Th>
											<Th>End Date</Th>
											<Th>Leave Type</Th>
											<Th>Notes</Th>
										</Tr>
									</Thead>
									<Tbody>
										{absenceDetails.map((absence) => (
											<Tr key={absence._id}>
												<Td>{absence.type}</Td>
												<Td>{new Date(absence.startDate).toLocaleDateString()}</Td>
												<Td>{new Date(absence.endDate).toLocaleDateString()}</Td>
												<Td>{absence.leaveType}</Td>
												<Td>{absence.notes}</Td>
											</Tr>
										))}
									</Tbody>
								</Table>
							</TableContainer>
						) : (
						<p>No absence details found.</p>
						)}
					</ModalBody>
					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={onCloseDetails}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal> */}

      {/* {/ ********** for calendar *********** /} */}
      <Box overflow="auto" whiteSpace="nowrap">
        <HStack justifyContent="center" marginTop={16} marginBottom={8}>
          <input
            type="date"
            value={currentDate}
            onChange={handleCustomDate}
            style={{
              padding: 5,
              borderRadius: 5,
              border: "1px solid gray",
              cursor: "pointer",
            }}
          />
          <span>to</span>
          <input
            disabled
            type="date"
            value={getEndDateInCalender(viewIndex, currentDate)}
            style={{
              padding: 5,
              borderRadius: 5,
              cursor: "not-allowed",
              background: "lightgray",
              border: "1px solid gray",
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

            <Tbody>
              {employee && employee.length > 0 ? (
                employee.map((emp) => (
                  <Tr key={emp._id}>
                    <Td
                      style={{
                        fontSize: "14px",
                        fontWeight: "800",
                        border: "solid 1px #c5bcbc",
                      }}
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
                          style={{
                            fontSize: "14px",
                            fontWeight: "800",
                            textAlign: "center",
                            border: "solid 1px #c5bcbc",
                          }}
                          className="add_hover"
                        >
                          {absence ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() => handleEditOrDelete(absence)}
                            >
                              {`${convertDateToNewFormat(
                                absence.startDate
                              )} - ${convertDateToNewFormat(absence.endDate)}`}
                              &nbsp;&nbsp;
                              <StarIcon
                                style={{
                                  marginBottom: "10px",
                                  color:
                                    absence.type === "Paid vacation"
                                      ? "#00A7C4"
                                      : absence.type === "Sick leave"
                                      ? "#f8c150"
                                      : absence.type === "Special leave"
                                      ? "#543eac"
                                      : absence.type === "Special leave"
                                      ? "#ff910a"
                                      : "",
                                }}
                              />
                            </div>
                          ) : (
                            <AddIcon
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
                                onOpen();
                              }}
                              className="add_icon_hover"
                              sx={{ marginRight: "10px", color: "black" }}
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
    </Fragment>
  );
}
