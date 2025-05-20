import { useEffect, useState } from "react";
import {
  addNewEmployeeAPI,
  deleteEmployeeAPI,
  getEmployeeAPI,
  updateEmployeeAPI,
} from "../api";
import { useUser } from "./useUser";
import { useToast } from "../contexts/useToast";
import { actionTypes } from "../utils/constant";

export function useEmployees() {
  const { userId } = useUser();
  const showToast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionType, setActionType] = useState(actionTypes.ADD);
  const [isPermitted, setIsPermitted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      const res = await getEmployeeAPI();
      if (res.status === 200) {
        setEmployees(res?.data?.result);
      } else {
        if (res.status === 403) {
          setIsPermitted(false);
          showToast("You don't have permission to access this page", "error");
          return;
        }
        showToast(res?.message || "Failed to fetch employees", "error");
      }
    } catch (error) {
      showToast(
        error.message || "An error occurred while fetching employees",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchEmployees().finally(() => setIsLoading(false));
  }, []);

  //Search an employee
  const filterEmployees = () => {
    return employees?.filter((employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Add a new employee
  const addEmployee = async (formData) => {
    const newEmployee = { ...formData, created_by: userId };
    try {
      setIsLoading(true);
      const res = await addNewEmployeeAPI(newEmployee);
      if (res.status === 200) {
        showToast("Employee added successfully", "success");
        setEmployees((prev) => [...prev, res.data]);
        setIsModalOpen(false);
      } else {
        showToast(res.message, "error");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing employee
  const updateEmployee = async (formData) => {
    if (!employeeId) return;
    try {
      setIsLoading(true);
      const res = await updateEmployeeAPI(employeeId, formData);
      if (res.status === 200) {
        showToast("Employee updated successfully", "success");
        setEmployees((prev) =>
          prev.map((employee) =>
            employee._id === employeeId
              ? { ...employee, ...formData }
              : employee
          )
        );
        setIsModalOpen(false);
      } else {
        showToast(res.message, "error");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an employee
  const deleteEmployee = async (id) => {
    try {
      setIsLoading(true);
      const res = await deleteEmployeeAPI(id);
      if (res.status === 200) {
        showToast("Employee deleted successfully", "success");
        setEmployees((prev) => prev.filter((employee) => employee._id !== id));
      } else {
        showToast("Failed to delete employee", "error");
      }
    } catch (error) {
      showToast(error.message || "Failed to delete employee", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Modal handlers
  const openModalForAdd = () => {
    setActionType(actionTypes.ADD);
    setIsModalOpen(true);
  };

  const openModalForEdit = (employee) => {
    setActionType(actionTypes.EDIT);
    setEmployeeId(employee._id);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const openModalForView = (employee) => {
    setActionType(actionTypes.VIEW);
    setEmployeeId(employee._id);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setEmployeeId(null);
    setSelectedEmployee(null);
  };

  return {
    userId,
    employees,
    setEmployees,
    employeeId,
    setEmployeeId,
    actionType,
    setActionType,
    isModalOpen,
    setIsModalOpen,
    selectedEmployee,
    setSelectedEmployee,
    isLoading,
    setIsLoading,
    isPermitted,
    setIsPermitted,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    openModalForAdd,
    openModalForEdit,
    openModalForView,
    onModalClose,
    filterEmployees,
    searchQuery,
    setSearchQuery,
  };
}
