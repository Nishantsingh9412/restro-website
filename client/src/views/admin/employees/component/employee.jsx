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
import ForbiddenPage from "../../../../components/forbiddenPage/ForbiddenPage";
import { useToast } from "../../../../contexts/useToast";

export default function EmployeeComponent() {
  const showToast = useToast();
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [actionType, setActionType] = useState("add");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // To hold employee data for view/edit
  const [isLoading, setIsLoading] = useState(true);
  const [isPermitted, setIsPermitted] = useState(true);

  // Fetch employees on component mount
  useEffect(() => {
    getEmployees().finally(() => setIsLoading(false));
  }, []);

  // Function to fetch employees from the API
  const getEmployees = async () => {
    const res = await dispatch(getEmployeeApi());
    showToast(res.message, res.success ? "success" : "error");
    if (res.success) setEmployees(res.data);
    else {
      if (res.status === 403) {
        setIsPermitted(false);
      }
    }
  };

  // Function to fetch employee details for viewing/editing
  const getEmployeeDetail = async (id) => {
    const res = await dispatch(getEmployeeDetailApi(id));
    if (res.success) {
      console.log(res);
      // Set the employee data and open the modal in edit mode
      setSelectedEmployee(res.data); // Set selected employee data
      setEmployeeId(id);
      setActionType("edit");
      setIsOpen(true);
    }
  };

  // Function to add a new employee
  const addEmployee = async (formData) => {
    const userId = JSON.parse(localStorage.getItem("ProfileData")).result._id;
    const newEmployee = { ...formData, created_by: userId };

    try {
      const res = await dispatch(postEmployeeApi(newEmployee));
      if (res.success) {
        toast.success("Employee added successfully");
        getEmployees();
        setIsOpen(false);
      } else {
        toast.error("Failed to add employee", res.message);
      }
    } catch (error) {
      toast.error("Error to add employee", error);
    }
  };

  // Function to update an existing employee
  const updateEmployee = async (formData) => {
    if (!employeeId) return;

    try {
      const res = await dispatch(updateEmployeeApi(employeeId, formData));
      if (res.success) {
        toast.success("Employee updated successfully");
        getEmployees();
        setIsOpen(false);
      } else {
        toast.error("Failed to update employee");
      }
    } catch (error) {
      toast.error("Failed to update employee", error);
    }
  };

  // Function to delete an employee
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

  // Function to open the modal for adding a new employee
  const openModalForAdd = () => {
    setActionType("add");
    setEmployeeId(""); // Reset employeeId for adding
    setSelectedEmployee(null); // Clear selected employee data
    setIsOpen(true);
  };

  // Function to close the modal
  const onModalClose = () => {
    setIsOpen(false);
    setEmployeeId(""); // Reset employeeId for adding
    setSelectedEmployee(null); // Clear selected employee data
  };

  // If user is not permitted to access the page
  if (!isPermitted) {
    return <ForbiddenPage isPermitted={isPermitted} />;
  }

  // Show loading spinner while data is being fetched
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
              <Th style={{ borderBottom: "2px solid black" }}>Role</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Type</Th>
              <Th style={{ borderBottom: "2px solid black" }}>Phone</Th>
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
                  <Td>{emp.role}</Td>
                  <Td>{emp.type}</Td>
                  <Td>{emp.phone}</Td>
                  <Td>
                    {/* View Employee Button */}
                    <IconButton
                      margin="0px 2px"
                      colorScheme="green"
                      aria-label="View"
                      icon={<IoMdEye />}
                      onClick={() => {
                        setSelectedEmployee(emp); // Set selected employee data for view
                        setActionType("view");
                        setIsOpen(true);
                      }}
                    />
                    {/* Edit Employee Button */}
                    <IconButton
                      margin="0px 2px"
                      colorScheme="yellow"
                      aria-label="Edit"
                      icon={<IoPencilOutline />}
                      onClick={() => getEmployeeDetail(emp._id)}
                    />
                    {/* Delete Employee Button */}
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
