import { FaStar } from "react-icons/fa";
import { useToast } from "../../../../contexts/useToast";
import AbsenceModal from "./component/absenceModal";
import useAbsence from "../../../../hooks/useAbsence";
import { isFutureDate } from "../../../../utils/utils";
import PageLoader from "../../../../components/UI/Loader";
import { Input } from "../../../../components/common/InputField";
import { PageHeading } from "../../../../components/UI/PageHeading";
import { PageFooter } from "../../../../components/UI/PageFooter";
import {
  IoAdd,
  IoArrowBack,
  IoArrowForward,
  IoPencilOutline,
} from "react-icons/io5";
import PrimaryActionButton from "../../../../components/UI/PrimaryActionButton";

const convertDateToNewFormat = (dateString) => {
  const date = new Date(dateString).toISOString().split("T")[0];
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

export default function AbsenceComponent() {
  const {
    view,
    isLoading,
    currentDate,
    setCurrentDate,
    searchQuery,
    setSearchQuery,
    daysToDisplay,
    handleDateChange,
    filterEmployees,
    selectedAbsence,
    handleViewModeChange,
    handleAbsenceAction,
    handleDeleteAbsence,
    isModalOpen,
    modalRef,
    handleAdd,
    handleEdit,
    handleModalClose,
  } = useAbsence();

  const toast = useToast();
  const employeeWithAbsences = filterEmployees();

  const handlePrev = () => {
    handleDateChange(view === "Daily" ? -1 : view === "Weekly" ? -7 : -30);
  };
  const handleNext = () => {
    handleDateChange(view === "Daily" ? 1 : view === "Weekly" ? 7 : 30);
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <PageHeading title={"Absence Management"} />
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-sm bg-[#00A7C4]"></span>
          <span>Paid Vacation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-sm bg-[#F8C150]"></span>
          <span>Sick</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-sm bg-[#543EAC]"></span>
          <span>Special leave</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-sm bg-[#FF910A]"></span>
          <span>Unpaid vacation</span>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto max-h-[70vh] m-1">
        <table className="min-w-full text-sm">
          <thead className="bg-primary text-white sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4 border text-left font-semibold">
                Employee Name
              </th>
              {daysToDisplay.map((day, idx) => (
                <th key={idx} className="p-4 border text-center font-semibold">
                  {day.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employeeWithAbsences.length > 0 ? (
              employeeWithAbsences.map((emp) => (
                <tr key={emp._id} className="even:bg-[#ebebfa] odd:bg-white">
                  <td className="border px-4 py-3 font-medium">{emp.name}</td>
                  {daysToDisplay.map((day, index) => {
                    const dateKey = day.toDateString();
                    const absences = emp?.absenceMap?.get(dateKey) || [];
                    const isDateValid = isFutureDate(day);

                    return (
                      <td key={index} className="border px-2 py-2 text-center">
                        {absences.length > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            {absences.map((absence) => (
                              <div
                                key={absence._id}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <FaStar
                                  className="text-md"
                                  color={
                                    absence.type === "Paid vacation"
                                      ? "#00A7C4"
                                      : absence.type === "Sick leave"
                                      ? "#f8c150"
                                      : absence.type === "Special leave"
                                      ? "#543eac"
                                      : absence.type === "Unpaid vacation"
                                      ? "#ff910a"
                                      : "black"
                                  }
                                />
                                <span>
                                  {`${convertDateToNewFormat(
                                    absence.startDate
                                  )} — ${convertDateToNewFormat(
                                    absence.endDate
                                  )}`}
                                </span>
                                <IoPencilOutline
                                  className={`text-md ${
                                    isDateValid
                                      ? "cursor-pointer"
                                      : "cursor-not-allowed"
                                  }`}
                                  onClick={() => {
                                    !isDateValid
                                      ? toast(
                                          "You can't edit absence for past dates or within 24 hours",
                                          "error"
                                        )
                                      : handleEdit(absence, emp);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <IoAdd
                              className={`text-lg  ${
                                isDateValid
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                              }`}
                              onClick={() => {
                                isDateValid
                                  ? handleAdd(emp, day)
                                  : toast(
                                      "You can't add absence for past dates or within 24 hours",
                                      "error"
                                    );
                              }}
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
                  colSpan={daysToDisplay.length + 1}
                  className="py-4 text-center text-gray-500"
                >
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AbsenceModal
          modalRef={modalRef}
          onClose={handleModalClose}
          isOpen={isModalOpen}
          leaveData={selectedAbsence}
          onSubmit={handleAbsenceAction}
          onDelete={handleDeleteAbsence}
        />
      )}

      <PageFooter />
    </>
  );
}
