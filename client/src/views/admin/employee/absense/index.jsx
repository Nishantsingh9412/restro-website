import { Fragment } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  HStack,
  Input,
  Box,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, StarIcon, EditIcon } from "@chakra-ui/icons";
import { useToast } from "../../../../contexts/useToast";
import AbsenceModal from "./component/absenceModal";
import { Spinner } from "@chakra-ui/react";
import useAbsence from "../../../../hooks/useAbsence";
import { isFutureDate } from "../../../../utils/utils";

// Convert date to new format
const convertDateToNewFormat = (dateString) => {
  const date = new Date(dateString).toISOString().split("T")[0];
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

export default function AbsenseComponent() {
  const {
    view,
    isLoading,
    currentDate,
    setCurrentDate,
    searchQuery,
    setSearchQuery,
    daysToDisplay,
    handleDateChange,
    filterEmployees,
    selectedAbsence,
    handleViewModeChange,
    handleAbsenceAction,
    handleDeleteAbsence,
    isModalOpen,
    handleAdd,
    handleEdit,
    handleModalClose,
  } = useAbsence();
  const toast = useToast();
  // Fetch Employee with absence data
  const employeeWithAbsences = filterEmployees();

  // Handle Preview and Next button clicks
  const handlePrev = () => {
    handleDateChange(view === "Daily" ? -1 : view === "Weekly" ? -7 : -30);
  };
  const handleNext = () => {
    handleDateChange(view === "Daily" ? 1 : view === "Weekly" ? 7 : 30);
  };

  // Show loading spinner if data is being fetched
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
            value={daysToDisplay.at(-1).toISOString().split("T")[0]}
          />
        </HStack>
        <Flex justifyContent={"space-between"} px={5}>
          <HStack justifyContent="center" mb={4}>
            <Button onClick={handlePrev}>Previous</Button>
            <Button onClick={handleViewModeChange}>View Mode: {view}</Button>
            <Button onClick={handleNext}>Next</Button>
          </HStack>
          {/* Employee Search Bar */}
          <Input
            placeholder="Search Employee"
            size="md"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            width={{ base: "100%", md: "300px" }}
            color="gray.700"
            borderColor="teal.500"
            focusBorderColor="teal.600"
            _hover={{ borderColor: "teal.600" }}
            backgroundColor="white"
          />
        </Flex>
        <TableContainer
          bg="white"
          p={4}
          borderRadius="8px"
          boxShadow="md"
          overflowY={"auto"}
          maxHeight="70vh"
        >
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th border="1px solid #000000" fontWeight="800" fontSize="14px">
                  Employee Name
                </Th>
                {daysToDisplay.map((day, idx) => (
                  <Th key={idx} border="1px solid #000">
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
              {employeeWithAbsences?.length > 0 ? (
                employeeWithAbsences?.map((emp) => (
                  <Tr key={emp._id}>
                    <Td border="1px solid #c5bcbc">{emp.name}</Td>
                    {daysToDisplay.map((day, index) => {
                      const dateKey = day?.toDateString();
                      const absences = emp?.absenceMap.get(dateKey) || [];
                      // Check if the date is valid to add/edit absence
                      const isDateValid = isFutureDate(day);

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
                                      !isDateValid
                                        ? toast(
                                            "You can't edit absence for past dates or within 24 hours",
                                            "error"
                                          )
                                        : handleEdit(absence, emp);
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
                                isDateValid
                                  ? handleAdd(emp, day)
                                  : toast(
                                      "You can't add absence for past dates or within 24 hours",
                                      "error"
                                    );
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
      {isModalOpen && (
        <AbsenceModal
          onClose={handleModalClose}
          isOpen={isModalOpen}
          leaveData={selectedAbsence}
          onSubmit={handleAbsenceAction}
          onDelete={handleDeleteAbsence}
        />
      )}
    </Fragment>
  );
}
