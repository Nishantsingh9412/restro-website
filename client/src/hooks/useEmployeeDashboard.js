import { useEffect, useState } from "react";
import {
  getTodayAbsentDataAPI,
  getEmployeeShiftDataAPI,
  getUpcomingBirthdayAPI,
  getBirthdayDataAPI,
} from "../api";

export function useEmployeeDashboard() {
  const [employeeShift, setEmployeeShift] = useState([]);
  const [employeeAbsense, setEmployeeAbsense] = useState([]);
  const [birthdays, setBirthdays] = useState({
    today: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAbsent = async () => {
    try {
      const res = await getTodayAbsentDataAPI();
      if (res.status === 200 && res.data.success)
        setEmployeeAbsense(res.data.result || []);
      else console.error("Failed to fetch absences", res.message);
    } catch (error) {
      console.error("Error fetching absences", error);
    }
  };

  const fetchEmployeeShift = async () => {
    try {
      const res = await getEmployeeShiftDataAPI();
      if (res.status === 200 && res.data.success)
        setEmployeeShift(res.data.result || []);
      else console.error("Failed to fetch employee shifts", res.message);
    } catch (error) {
      console.error("Error fetching employee shifts", error);
    }
  };

  const fetchBirthdays = async () => {
    try {
      const res = await getBirthdayDataAPI();
      if (res.status === 200 && res.data.success)
        setBirthdays((prev) => ({ ...prev, today: res.data.result || [] }));
      else console.error("Failed to fetch birthdays", res.message);
    } catch (error) {
      console.error("Error fetching birthdays", error);
    }
  };

  const fetchUpcomingBirthdays = async () => {
    try {
      const res = await getUpcomingBirthdayAPI();
      if (res.status === 200 && res.data.success)
        setBirthdays((prev) => ({ ...prev, upcoming: res.data.result || [] }));
      else console.error("Failed to fetch upcoming birthdays", res.message);
    } catch (error) {
      console.error("Error fetching upcoming birthdays", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          fetchBirthdays(),
          fetchUpcomingBirthdays(),
          fetchEmployeeShift(),
          fetchAbsent(),
        ]);
      } catch (error) {
        console.error("Error initializing dashboard data", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    loading,
    birthdays,
    employeeShift,
    employeeAbsense,
  };
}
