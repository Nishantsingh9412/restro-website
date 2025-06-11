import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Input,
  Flex,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaTrash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoEllipsisVerticalSharp, IoPencilOutline } from "react-icons/io5";
import EmployeeModal from "./component/employeeModal";
import { Spinner, Center } from "@chakra-ui/react";
import ForbiddenPage from "../../../../components/forbiddenPage/ForbiddenPage";
import { actionTypes, Dialog_Boxes } from "../../../../utils/constant";
import { useEmployees } from "../../../../hooks/useEmployee";

export default function EmployeeComponent() {
  // use employee hook to control logic flow
  const {
    isLoading,
    isPermitted,
    actionType,
    isModalOpen,
    onModalClose,
    openModalForAdd,
    openModalForEdit,
    selectedEmployee,
    openModalForView,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    filterEmployees,
    searchQuery,
    setSearchQuery,
  } = useEmployees();

  // Get filtered employees based on search query
  const employees = filterEmployees();

  // Handle form submission for adding or updating employee
  const handleSubmit = async (formData) => {
    const submitAction =
      actionType === actionTypes.ADD ? addEmployee : updateEmployee;
    try {
      await submitAction(formData);
      return { success: true };
    } catch (error) {
      console.error("Submission Error:", error);
      return { success: false };
    }
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <Center height="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // If user is not permitted to access the page
  if (!isPermitted) {
    return <ForbiddenPage isPermitted={isPermitted} />;
  }

  return (
    <>
      <Flex justifyContent={"space-between"} alignItems="center">
        {/* Add Employee Button */}
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          variant="outline"
          onClick={openModalForAdd}
          margin={{ base: "10px", md: "10px" }}
        >
          Add New Employee
        </Button>
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
      {/* Employee Table */}
      <TableContainer
        style={{ backgroundColor: "white", padding: "10px" }}
        overflowY={"auto"}
        maxHeight={"75vh"}
      >
        <Table variant="bordered">
          <Thead>
            <Tr>
              <Th style={{ borderBottom: "2px solid black" }}>Name</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Role</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Type</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Phone</Th>
              <Th style={{ borderBottom: "2px solid black" }}>W. Hours</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees?.length === 0 ? (
              <Tr>
                <Td colSpan="5">No Data</Td>
              </Tr>
            ) : (
              employees?.map((emp) => (
                <Tr key={emp._id}>
                  <Td>{emp.name}</Td>
                  <Td>{emp.role}</Td>
                  <Td>{emp.empType}</Td>
                  <Td>{emp.phone}</Td>
                  <Td>
                    {emp.workingHoursPerWeek
                      ? emp.workingHoursPerWeek + "Hrs"
                      : "N/A"}
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<IoEllipsisVerticalSharp />}
                        variant="ghost"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<IoMdEye />}
                          onClick={() => openModalForView(emp)}
                        >
                          View Item
                        </MenuItem>
                        <MenuItem
                          icon={<IoPencilOutline />}
                          onClick={() => openModalForEdit(emp)}
                        >
                          Edit Item
                        </MenuItem>
                        <MenuItem
                          icon={<FaTrash />}
                          onClick={() =>
                            Dialog_Boxes.showDeleteConfirmation(() => {
                              deleteEmployee(emp._id);
                            })
                          }
                        >
                          Delete Item
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        actionType={actionType}
        employeeData={selectedEmployee}
        onSubmit={handleSubmit}
      />
    </>
  );
}
