import { useEffect } from "react";
import ShiftTable from "./components/ShiftTable";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeShifts } from "../../../redux/action/Employees/employee";
import PageLoader from "../../../components/UI/Loader";

function EmployeeShifts() {
  const dispatch = useDispatch();
  const { loading, shifts } = useSelector((state) => state.employee);

  // Fetch employee shifts when the component mounts
  useEffect(() => {
    dispatch(getEmployeeShifts());
  }, [dispatch]);

  // Show a spinner while loading
  if (loading) {
    return <PageLoader />;
  }

  const currentDate = new Date();
  // Separate shifts into past and upcoming based on the current date
  const [pastShifts, todayShifts, upcomingShifts] = (shifts || []).reduce(
    ([past, today, upcoming], shift) => {
      const shiftDate = new Date(shift.date).setHours(0, 0, 0, 0);
      const currentDateOnly = currentDate.setHours(0, 0, 0, 0);

      if (shiftDate < currentDateOnly) {
        past.push(shift);
      } else if (shiftDate === currentDateOnly) {
        today.push(shift);
      } else {
        upcoming.push(shift);
      }

      return [past, today, upcoming];
    },
    [[], [], []]
  );

  return (
    <div className="p-6">
      {/* Display upcoming shifts */}
      <ShiftTable header="Upcoming Shifts" shiftData={upcomingShifts} />
      {/* Display Today Current shifts */}
      <ShiftTable header="Today's Shifts" shiftData={todayShifts} />
      {/* Display past shifts */}
      <ShiftTable header="Past Shifts" shiftData={pastShifts} />
    </div>
  );
}

export default EmployeeShifts;
