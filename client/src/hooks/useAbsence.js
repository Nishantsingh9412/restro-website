import { useState, useEffect, useMemo } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "../contexts/useToast";
import { getDateRangeForView } from "../utils/utils";
import {
  addAbsenceData,
  deleteAbsenceData,
  editAbsenceData,
  getAbsenceByEmpl,
} from "../api";

const views = ["Daily", "Weekly", "Monthly"];

const useAbsence = () => {
  const showToast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [empAbsences, setEmpAbsences] = useState([]);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [viewIndex, setViewIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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

  // Opens the modal to add a new absence for a specific employee and day
  const handleAdd = (emp, day) => {
    setSelectedAbsence({
      employeeId: emp._id,
      empName: emp.name,
      startDate: day,
    });
    onModalOpen();
  };

  // Opens the modal to edit an existing absence for a specific employee
  const handleEdit = (absence, emp) => {
    setSelectedAbsence({ ...absence, empName: emp.name });
    onModalOpen();
  };

  // Closes the absence modal and resets the selected absence
  const handleModalClose = () => {
    setSelectedAbsence(null);
    onModalClose();
  };

  // Handles adding or editing a absence (submits the absence data)
  const handleAbsenceAction = async (absenceData) => {
    // Check absence data available or not
    if (!absenceData) return;

    // Check action mode Add/Edit
    const absenceId = selectedAbsence?._id;
    absenceData = absenceId ? { ...absenceData, _id: absenceId } : absenceData;
    const submitAction = absenceId ? editAbsenceData : addAbsenceData;

    try {
      const res = await submitAction(absenceData);
      if (res.status === 200 || res.status === 201) {
        showToast(
          absenceId
            ? "Absence updated successfully"
            : "Absence added successfully",
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
    }
  };

  // Handles deleting a absence by its ID
  const handleDeleteAbsence = async () => {
    const absenceId = selectedAbsence?._id;
    if (!absenceId) {
      showToast("Absence not found", "error");
      return;
    }
    try {
      const res = await deleteAbsenceData({ _id: absenceId });
      if (res && res.status === 200) {
        showToast("absence deleted successfully", "success");
        await fetchData();
        handleModalClose();
      } else if (res && res.message) {
        showToast(res.message, "error");
      } else {
        showToast("Failed to delete absence. Please try again.", "error");
      }
    } catch (error) {
      showToast(
        error?.message || "Failed to delete absence. Please try again.",
        "error"
      );
    }
  };

  // Processe the employess in absence map based on the days
  const processedEmployees = useMemo(() => {
    return empAbsences.map((emp) => {
      const absenceMap = new Map();

      // Iterate for every absence of particular employee
      emp.absences?.forEach((absence) => {
        const start = new Date(absence.startDate);
        const end = new Date(absence.endDate);
        const current = new Date(start);

        // Check until the leave end
        while (current <= end) {
          const dateKey = current.toDateString();

          if (!absenceMap.has(dateKey)) {
            absenceMap.set(dateKey, []);
          }

          absenceMap.get(dateKey)?.push(absence);
          current.setDate(current.getDate() + 1);
        }
      });

      return { ...emp, absenceMap };
    });
  }, [empAbsences]);

  //Search an employee
  const filterEmployees = () => {
    return processedEmployees?.filter((employee) =>
      employee?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  };

  // Fetches all employee absence data from the server
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getAbsenceByEmpl();
      if (res.status === 200) setEmpAbsences(res?.data?.result ?? []);
      else showToast(res.message || "Failed to fetch absences", "error");
    } catch (error) {
      showToast(error.message || "Failed to fetch absences", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    view,
    empAbsences,
    searchQuery,
    setSearchQuery,
    filterEmployees,
    isLoading,
    currentDate,
    selectedAbsence,
    daysToDisplay,
    setCurrentDate,
    handleDateChange,
    handleViewModeChange,
    handleAdd,
    handleEdit,
    isModalOpen,
    handleModalClose,
    handleAbsenceAction,
    handleDeleteAbsence,
  };
};

export default useAbsence;
