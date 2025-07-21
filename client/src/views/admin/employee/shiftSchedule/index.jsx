import {
  IoAdd,
  IoArrowBack,
  IoArrowForward,
  IoPencilOutline,
} from "react-icons/io5";
import { useToast } from "../../../../contexts/useToast";
import ShiftModal from "./component/ShiftAddEditModal";
import useShiftSchedule from "../../../../hooks/useShiftSchedule";
import { isFutureDate } from "../../../../utils/utils";
import { PageHeading } from "../../../../components/UI/PageHeading";
import PrimaryActionButton from "../../../../components/UI/PrimaryActionButton";
import PageLoader from "../../../../components/UI/Loader";
import { PageFooter } from "../../../../components/UI/PageFooter";
import { Input } from "../../../../components/common/InputField";

const formatShiftTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

export default function ShiftScheduleComponent() {
  const {
    view,
    searchQuery,
    setSearchQuery,
    filterEmployees,
    selectedShift,
    isLoading,
    isSubmitting,
    daysToDisplay,
    currentDate,
    setCurrentDate,
    handleViewModeChange,
    handleDateChange,
    handleAdd,
    handleEdit,
    isModalOpen,
    modalRef,
    handleModalClose,
    handleShiftAction,
    handleDeleteShift,
  } = useShiftSchedule();
  const showToast = useToast();

  const employeesWithShifts = filterEmployees();

  const handlePrev = () => {
    handleDateChange(view === "Daily" ? -1 : view === "Weekly" ? -7 : -30);
  };

  const handleNext = () => {
    handleDateChange(view === "Daily" ? 1 : view === "Weekly" ? 7 : 30);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="px-2">
      <PageHeading title="Shift Schedule" />

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
        <PrimaryActionButton
          onClick={handleViewModeChange}
          className="!text-md !font-medium h-10"
        >
          View Mode: {view}
        </PrimaryActionButton>

        <div className="flex items-center gap-2">
          <Input
            label="Start Date"
            type="date"
            value={currentDate}
            onChange={(e) =>
              setCurrentDate(e.target.value ? e.target.value : currentDate)
            }
          />
          <span className="text-sm">to</span>
          <Input
            label="End Date"
            disabled
            type="date"
            value={daysToDisplay.at(-1).toISOString().split("T")[0]}
          />
          <Input
            label="Search Employee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 mb-2 mx-1">
        <PrimaryActionButton onClick={handlePrev}>
          <IoArrowBack />
          Previous
        </PrimaryActionButton>
        <PrimaryActionButton onClick={handleNext}>
          Next
          <IoArrowForward />
        </PrimaryActionButton>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl my-2 border border-gray-200 overflow-x-auto max-h-[75vh]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary text-white h-12 sticky top-0 z-10">
              <th className="py-2 px-6 text-left font-semibold !border-b">
                Employee Name
              </th>
              <th className="py-2 px-4 text-center font-semibold !border-b">
                W. Hours Left
              </th>
              {daysToDisplay.map((day, idx) => (
                <th
                  key={idx}
                  className="py-2 px-4 text-center font-semibold !border-b"
                >
                  {day.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employeesWithShifts?.length ? (
              employeesWithShifts.map((emp) => (
                <tr key={emp._id} className="even:bg-[#ebebfa] odd:bg-white">
                  <td className="py-2 px-6 text-gray-800 font-medium">
                    {emp.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {emp.workingHoursPerWeek ?? "N/A"}
                  </td>
                  {daysToDisplay.map((day, idx) => {
                    const dateKey = day.toDateString();
                    const shift = emp.shiftMap.get(dateKey);
                    const valid = isFutureDate(day);
                    return (
                      <td key={idx} className="py-3 px-4 text-center">
                        {shift ? (
                          <div className="flex items-center justify-center gap-1">
                            <span>
                              {`${formatShiftTime(
                                shift.from
                              )} - ${formatShiftTime(shift.to)}`}
                            </span>
                            <IoPencilOutline
                              className={`text-lg cursor-${
                                valid ? "pointer" : "not-allowed"
                              }`}
                              onClick={() =>
                                valid
                                  ? handleEdit(shift, emp)
                                  : showToast(
                                      "Cannot edit shift within 24 hrs or past",
                                      "error"
                                    )
                              }
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <IoAdd
                              className={`text-lg cursor-${
                                valid ? "pointer" : "not-allowed"
                              }`}
                              onClick={() =>
                                valid
                                  ? handleAdd(emp, day)
                                  : showToast(
                                      "Cannot add shift within 24 hrs or past",
                                      "error"
                                    )
                              }
                            />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={daysToDisplay.length + 2}
                  className="py-4 text-center text-gray-500"
                >
                  No shift data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PageFooter />

      {isModalOpen && (
        <ShiftModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          modalRef={modalRef}
          shiftData={selectedShift}
          onSubmit={handleShiftAction}
          handleDeleteShift={handleDeleteShift}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
