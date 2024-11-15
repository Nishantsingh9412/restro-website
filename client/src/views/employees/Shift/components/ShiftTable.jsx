import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Text,
  Badge,
} from "@chakra-ui/react";

// ShiftTable component to display shift data in a table format
const ShiftTable = ({ shiftData, header }) => {
  // Function to convert time to a readable format
  const convertTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Function to convert date to a readable format
  const convertDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      boxShadow="lg"
      my={10}
    >
      <Heading size="lg" mb={6} textAlign="left" color="teal.500">
        {header}
      </Heading>
      <Table variant="simple" colorScheme="blue">
        <Thead bg="blue.100">
          <Tr>
            <Th>Date</Th>
            <Th>Duration</Th>
            <Th>Shift Start</Th>
            <Th>Shift End</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {shiftData && shiftData.length > 0 ? (
            shiftData.map((shift, index) => (
              <Tr key={index} _hover={{ bg: "blue.50" }}>
                <Td>
                  <Text fontWeight="bold">
                    {shift?.date ? convertDate(shift.date) : "N/A"}
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme="blue">{shift.duration || "N/A"}</Badge>
                </Td>
                <Td>{shift?.from ? convertTime(shift.from) : "N/A"}</Td>
                <Td>{shift?.to ? convertTime(shift.to) : "N/A"}</Td>
                <Td>
                  <Badge
                    colorScheme="green"
                    onClick={() => console.log("clicked")}
                    cursor="pointer"
                  >
                    View
                  </Badge>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="5" textAlign="center">
                No shift available
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ShiftTable;
