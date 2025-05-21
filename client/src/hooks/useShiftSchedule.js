import { useState, useEffect, useMemo } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "../contexts/useToast";
import { getDateRangeForView } from "../utils/utils";

import {
  addShiftData,
  deleteShiftData,
  editShiftData,
  getShiftByEmpl,
} from "../api";

const views = ["Daily", "Weekly", "Monthly"];

const useShiftSchedule = () => {
  const showToast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [empShifts, setEmpShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [viewIndex, setViewIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const view = views[viewIndex];

  const daysToDisplay = useMemo(
    () => getDateRangeForView(view, currentDate),
    [view, currentDate]
  );

  // Handle the date changes based on the selected view mode
  const handleDateChange = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + amount);
    setCurrentDate(newDate.toISOString().split("T")[0]);
  };

  // Switches the view mode between Daily, Weekly, and Monthly
  const handleViewModeChange = () =>
    setViewIndex((prev) => (prev + 1) % views.length);

  // Opens the modal to add a new shift for a specific employee and day
  const handleAdd = (emp, day) => {
    setSelectedShift({ employeeId: emp._id, empName: emp.name, date: day });
    onModalOpen();
  };

  // Opens the modal to edit an existing shift for a specific employee
  const handleEdit = (shift, emp) => {
    setSelectedShift({ ...shift, empName: emp.name });
    onModalOpen();
  };

  // Closes the shift modal and resets the selected shift
  const handleModalClose = () => {
    setSelectedShift(null);
    onModalClose();
  };

  // Handles adding or editing a shift (submits the shift data)
  const handleShiftAction = async (shiftData) => {
    // Check shift data available or not
    if (!shiftData) return;

    // Check action mode Add/Edit
    const shiftId = selectedShift?._id;
    shiftData = shiftId ? { ...shiftData, _id: shiftId } : shiftData;
    const submitAction = shiftId ? editShiftData : addShiftData;

    try {
      setIsSubmitting(true);
      const res = await submitAction(shiftData);
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        showToast(
          shiftId ? "Shift updated successfully" : "Shift added successfully",
          "success"
        );
        fetchData();
        handleModalClose();
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      console.log(err);

      showToast("Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles deleting a shift by its ID
  const handleDeleteShift = async (shiftId) => {
    if (!shiftId) {
      showToast("Shift not found", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await deleteShiftData({ _id: shiftId });
      if (res && res.status === 200) {
        showToast("Shift deleted successfully", "success");
        await fetchData();
        handleModalClose();
      } else if (res && res.message) {
        showToast(res.message, "error");
      } else {
        showToast("Failed to delete shift. Please try again.", "error");
      }
    } catch (error) {
      showToast(
        error?.message || "Failed to delete shift. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // Processe the employess in shift map based on the days
  const processedEmployees = useMemo(
    () =>
      empShifts.map((emp) => {
        const shiftMap = new Map();

        emp.shifts?.forEach((shift) => {
          const dateKey = new Date(shift.date).toDateString();
          shiftMap.set(dateKey, shift);
        });

        return { ...emp, shiftMap };
      }),
    [empShifts]
  );

  //Search an employee
  const filterEmployees = () => {
    return processedEmployees?.filter((employee) =>
      employee?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  };

  // Fetches all employee shift data from the server
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getShiftByEmpl();
      if (res.status === 200) setEmpShifts(res?.data?.result ?? []);
      else showToast(res.message || "Failed to fetch shifts", "error");
    } catch (error) {
      showToast(error.message || "Failed to fetch shifts", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    view,
    empShifts,
    searchQuery,
    setSearchQuery,
    filterEmployees,
    processedEmployees,
    isLoading,
    currentDate,
    isSubmitting,
    selectedShift,
    daysToDisplay,
    setCurrentDate,
    handleDateChange,
    handleViewModeChange,
    handleAdd,
    handleEdit,
    isModalOpen,
    handleModalClose,
    handleShiftAction,
    handleDeleteShift,
  };
};

export default useShiftSchedule;
