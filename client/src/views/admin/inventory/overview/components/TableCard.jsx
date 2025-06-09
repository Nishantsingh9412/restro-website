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
                <Tr key={index}>
                  <Td>
                    {" "}
                    {row?.timestamp
                      ? new Date(row.timestamp).toLocaleDateString("en-GB")
                      : "--"}
                  </Td>
                  <Td>{row?.itemName}</Td>
                  <Td>
                    {row?.actionType[0]?.toUpperCase() +
                      row?.actionType.slice(1)}
                  </Td>
                  <Td>{row?.quantity}</Td>
                  <Td>{row?.userName}</Td>
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
