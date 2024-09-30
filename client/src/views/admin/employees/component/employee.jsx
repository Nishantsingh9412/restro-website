import "./emp.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  deleteEmployeeApi,
  getEmployeeApi,
  getEmployeeDetailApi,
  postEmployeeApi,
  updateEmployeeApi,
} from "../../../../redux/action/employee";
import { FaTrash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoPencilOutline } from "react-icons/io5";
import EmployeeModal from "./employeeModal";
import { Spinner, Center } from "@chakra-ui/react";

export default function EmployeeComponent() {
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [actionType, setActionType] = useState("add");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // To hold employee data for view/edit
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employees on component mount
  useEffect(() => {
    getEmployees().finally(() => setIsLoading(false));
  }, []);

  const getEmployees = async () => {
    const userData = JSON.parse(localStorage.getItem("ProfileData"));
    const res = await dispatch(getEmployeeApi(userData.result._id));
    if (res.success) setEmployees(res.data);
  };

  const getEmployeeDetail = async (id) => {
    const res = await dispatch(getEmployeeDetailApi(id));
    if (res.success) {
      // Set the employee data and open the modal in edit mode
      setSelectedEmployee(res.data[0]); // Set selected employee data
      setEmployeeId(id);
      setActionType("edit");
      setIsOpen(true);
    }
  };

  const addEmployee = async (formData) => {
    const userId = JSON.parse(localStorage.getItem("ProfileData")).result._id;
    const newEmployee = { ...formData, created_by: userId };
    console.log(newEmployee);

    try {
      const res = await dispatch(postEmployeeApi(newEmployee));
      if (res.success) {
        toast.success("Employee added successfully");
        getEmployees();
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add employee", error);
    }
  };

  const updateEmployee = async (formData) => {
    if (!employeeId) return;

    const res = await dispatch(updateEmployeeApi(employeeId, formData));
    if (res.success) {
      toast.success("Employee updated successfully");
      getEmployees();
      setIsOpen(false);
    } else {
      toast.error("Failed to update employee");
    }
  };

  const deleteEmployee = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (confirmation.isConfirmed) {
      const res = await dispatch(deleteEmployeeApi(id));
      if (res.success) {
        toast.success("Employee deleted successfully");
        getEmployees();
      } else {
        toast.error("Failed to delete employee");
      }
    }
  };

  const openModalForAdd = () => {
    setActionType("add");
    setEmployeeId(""); // Reset employeeId for adding
    setSelectedEmployee(null); // Clear selected employee data
    setIsOpen(true);
  };

  const onModalClose = () => {
    setIsOpen(false);
    setEmployeeId(""); // Reset employeeId for adding
    setSelectedEmployee(null); // Clear selected employee data
  };

  if (isLoading) {
    return (
      <Center height="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      {/* Add Employee Button */}
      <Button
        leftIcon={<AddIcon />}
        colorScheme="teal"
        variant="outline"
        onClick={openModalForAdd}
        margin={{ base: "10px", md: "20px" }}
      >
        Add New Employee
      </Button>

      {/* Employee Table */}
      <TableContainer style={{ backgroundColor: "white", padding: "10px" }}>
        <Table variant="bordered">
          <Thead>
            <Tr>
              <Th style={{ borderBottom: "2px solid black" }}>Name</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Position</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Phone</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Birthday</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.length === 0 ? (
              <Tr>
                <Td colSpan="5">No Data</Td>
              </Tr>
            ) : (
              employees.map((emp) => (
                <Tr key={emp._id}>
                  <Td>{emp.name}</Td>
                  <Td>{emp.position}</Td>
                  <Td>{emp.phone}</Td>
                  <Td>{new Date(emp.birthday).toLocaleDateString()}</Td>
                  <Td>
                    <IconButton
                      margin="0px 2px"
                      colorScheme="green"
                      aria-label="View"
                      icon={<IoMdEye />}
                      onClick={() => {
                        // console.log(emp);
                        setSelectedEmployee(emp); // Set selected employee data for view
                        setActionType("view");
                        setIsOpen(true);
                      }}
                    />
                    <IconButton
                      margin="0px 2px"
                      colorScheme="yellow"
                      aria-label="Edit"
                      icon={<IoPencilOutline />}
                      onClick={() => getEmployeeDetail(emp._id)}
                    />
                    <IconButton
                      margin="0px 2px"
                      colorScheme="red"
                      aria-label="Delete"
                      icon={<FaTrash />}
                      onClick={() => deleteEmployee(emp._id)}
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isOpen}
        onClose={onModalClose}
        actionType={actionType}
        employeeData={
          actionType === "edit" ? selectedEmployee : selectedEmployee
        } // Pass employee data for edit
        handleSubmit={actionType === "add" ? addEmployee : updateEmployee}
      />
    </>
  );
}
