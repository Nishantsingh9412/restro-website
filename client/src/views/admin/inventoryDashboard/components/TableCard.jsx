import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const TableCard = ({ tableData }) => {
  const dummyData = [
    {
      id: 1,
      date: "2023-10-01",
      itemName: "Tomatoes",
      action: "Added",
      quantity: 50,
      user: "John Doe",
    },
    {
      id: 2,
      date: "2023-10-02",
      itemName: "Potatoes",
      action: "Removed",
      quantity: 20,
      user: "Jane Smith",
    },
    {
      id: 3,
      date: "2023-10-03",
      itemName: "Carrots",
      action: "Added",
      quantity: 30,
      user: "Alice Johnson",
    },
    {
      id: 4,
      date: "2023-10-03",
      itemName: "Carrots",
      action: "Added",
      quantity: 20,
      user: "Nizam Shah",
    },
  ];

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
      bg="white"
    >
      {!tableData?.length > 0 ? (
        <Box
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={"200px"}
        >
          <Text fontSize="lg" textAlign="center">
            No Data Available
          </Text>
        </Box>
      ) : (
        <TableContainer>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th fontWeight={800}>Date</Th>
                <Th fontWeight={800}>Item Name</Th>
                <Th fontWeight={800}>Action</Th>
                <Th fontWeight={800}>Quantity</Th>
                <Th fontWeight={800}>User</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData?.slice(0, 4).map((row, index) => (
                <Tr key={dummyData[index]?.id}>
                  <Td>{dummyData[index]?.date}</Td>
                  <Td>{row?.item_name}</Td>
                  <Td>{dummyData[index]?.action}</Td>
                  <Td>{row?.available_quantity}</Td>
                  <Td>{dummyData[index]?.user}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
TableCard.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      item_name: PropTypes.string,
      available_quantity: PropTypes.number,
    })
  ),
};

export default TableCard;
