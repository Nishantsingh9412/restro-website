import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Button,
  Input,
  HStack,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useToast } from "../../../contexts/useToast";
import ShiftModal from "./component/ShiftAddEditModal";
import useShiftSchedule from "../../../hooks/useShiftSchedule";
import { isFutureDate } from "../../../utils/utils";

const formatShiftTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

const ShiftScheduleComponent = () => {
  const {
    view,
    searchQuery,
    setSearchQuery,
    filterEmployees,
    selectedShift,
    isLoading,
    isSubmitting,
    daysToDisplay,
    currentDate,
    setCurrentDate,
    handleViewModeChange,
    handleDateChange,
    handleAdd,
    handleEdit,
    isModalOpen,
    handleModalClose,
    handleShiftAction,
    handleDeleteShift,
  } = useShiftSchedule();
  const showToast = useToast();

  // Filter employees based on search query
  const employeesWithShifts = filterEmployees();

  // Handle date changes
  const handlePrev = () => {
    handleDateChange(view === "Daily" ? -1 : view === "Weekly" ? -7 : -30);
  };

  // Handle date changes
  const handleNext = () => {
    handleDateChange(view === "Daily" ? 1 : view === "Weekly" ? 7 : 30);
  };

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
    <Box overflow="auto" whiteSpace="nowrap" mt={16} mb={8}>
      {/* Controls */}
      <HStack justifyContent="center" mb={4}>
        <Input
          type="date"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
        />
        <span>to</span>
        <Input
          disabled
          type="date"
          value={daysToDisplay.at(-1).toISOString().split("T")[0]}
          bg="lightgray"
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

      {/* Table */}
      <TableContainer
        bg="white"
        p={5}
        borderRadius="8px"
        boxShadow="md"
        maxHeight="70vh"
        overflowY="auto"
      >
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th border="1px solid #000">Employee Name</Th>
              <Th border="1px solid #000">W. Hours Left</Th>
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
            {employeesWithShifts?.length ? (
              employeesWithShifts?.map((emp) => (
                <Tr key={emp._id}>
                  <Td border="1px solid #ababab">{emp.name}</Td>
                  <Td border="1px solid #ababab" textAlign="center">
                    {emp.workingHoursPerWeek ?? "N/A"}
                  </Td>
                  {daysToDisplay.map((day, idx) => {
                    const dateKey = day?.toDateString();
                    const shift = emp?.shiftMap.get(dateKey);
                    // Check if the date is valid to add/edit absence
                    const valid = isFutureDate(day);

                    return (
                      <Td
                        key={idx}
                        border="1px solid #ababab"
                        textAlign="center"
                        _hover={{ bg: "gray.200" }}
                      >
                        {shift ? (
                          <>
                            {`${formatShiftTime(
                              shift.from
                            )} - ${formatShiftTime(shift.to)}`}
                            &nbsp;&nbsp;
                            <EditIcon
                              mb="4px"
                              cursor={valid ? "pointer" : "not-allowed"}
                              onClick={() =>
                                valid
                                  ? handleEdit(shift, emp)
                                  : showToast(
                                      "Cannot edit shift within 24 hrs or past",
                                      "error"
                                    )
                              }
                            />
                          </>
                        ) : (
                          <AddIcon
                            cursor={valid ? "pointer" : "not-allowed"}
                            onClick={() =>
                              valid
                                ? handleAdd(emp, day)
                                : showToast(
                                    "Cannot add shift within 24 hrs or past",
                                    "error"
                                  )
                            }
                          />
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={daysToDisplay.length + 2} textAlign="center">
                  No shift data found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {/* Modal for Add/Edit Shift */}
      {isModalOpen && (
        <ShiftModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          shiftData={selectedShift}
          onSubmit={handleShiftAction}
          handleDeleteShift={handleDeleteShift}
          isSubmitting={isSubmitting}
        />
      )}
    </Box>
  );
};

export default ShiftScheduleComponent;
