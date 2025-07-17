import { IoMdEye } from "react-icons/io";
import {
  IoAdd,
  IoEllipsisVerticalSharp,
  IoPencilOutline,
} from "react-icons/io5";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import EmployeeModal from "./component/employeeModal";
import ForbiddenPage from "../../../../components/forbiddenPage/ForbiddenPage";
import { actionTypes, Dialog_Boxes } from "../../../../utils/constant";
import { useEmployees } from "../../../../hooks/useEmployee";
import PrimaryActionButton from "../../../../components/UI/PrimaryActionButton";
import { PageHeading } from "../../../../components/UI/PageHeading";
import { Input } from "../../../../components/common/InputField";
import { PageFooter } from "../../../../components/UI/PageFooter";
import PageLoader from "../../../../components/UI/Loader";
import DropdownActionButton from "../../../../components/UI/DropdownActionButton";

export default function EmployeeComponent() {
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

  const [menuOpen, setMenuOpen] = useState(null);

  const employees = filterEmployees();

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

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isPermitted) {
    return <ForbiddenPage isPermitted={isPermitted} />;
  }

  return (
    <>
      <PageHeading title={"Employees"} />
      <div className="px-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4  w-full mt-6">
          <PrimaryActionButton
            onClick={openModalForAdd}
            className="!text-md !font-medium h-10"
          >
            Add New Employee
            <IoAdd className="ml-2 !font-bold text-xl !text-white" />
          </PrimaryActionButton>
          <div className="w-full md:w-1/3">
            <Input
              label="Search Employee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Employee Table */}
        {/* TABLE for Desktop */}
        <div className="bg-white rounded-xl my-2 !border !border-gray-200 overflow-x-auto max-h-[75vh] hidden md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-primary text-white h-12 sticky top-0 z-10">
                <th className="py-2 px-8 text-left font-semibold border-b border-gray-300">
                  Name
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  Role
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  Type
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  Phone
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  W. Hours
                </th>
                <th className="py-2 px-4 text-left font-semibold border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No Data
                  </td>
                </tr>
              ) : (
                employees?.map((emp) => (
                  <tr key={emp._id} className="even:bg-[#ebebfa] odd:bg-white">
                    <td className="py-2 px-8">
                      <div className="flex gap-2 items-center">
                        <img
                          src={emp.pic || "https://www.gravatar.com/avatar/..."}
                          alt={emp.name || "N/A"}
                          className="!w-10 !h-10 rounded-full object-cover border !hidden sm:!block"
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {emp.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4">{emp.role}</td>
                    <td className="py-2 px-4">{emp.empType}</td>
                    <td className="py-2 px-4">{emp.phone}</td>
                    <td className="py-2 px-4">
                      {emp.workingHoursPerWeek
                        ? emp.workingHoursPerWeek + " Hrs"
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 relative">
                      {/* Action Dropdown */}
                      <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={() =>
                          setMenuOpen(menuOpen === emp._id ? null : emp._id)
                        }
                      >
                        <IoEllipsisVerticalSharp className="text-xl" />
                      </button>
                      {menuOpen === emp._id && (
                        <div className="absolute p-2 z-10 top-6 right-26 mt-2 w-40 bg-white !border !border-gray-200 rounded shadow-lg">
                          <DropdownActionButton
                            onClick={() => {
                              openModalForView(emp);
                              setMenuOpen(null);
                            }}
                            icon={<IoMdEye className="w-4 h-4" />}
                            className="!text-blue-600"
                          >
                            View Item
                          </DropdownActionButton>
                          <DropdownActionButton
                            onClick={() => {
                              openModalForEdit(emp);
                              setMenuOpen(null);
                            }}
                            icon={<IoPencilOutline className="w-4 h-4" />}
                            className="!text-blue-600"
                          >
                            Edit Item
                          </DropdownActionButton>
                          <DropdownActionButton
                            onClick={() => {
                              Dialog_Boxes.showDeleteConfirmation(() =>
                                deleteEmployee(emp._id)
                              );
                              setMenuOpen(null);
                            }}
                            icon={<FaTrash className="w-4 h-4" />}
                            className="!text-red-600"
                          >
                            Delete Item
                          </DropdownActionButton>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CARD layout for Mobile */}
        <div className="md:hidden space-y-4 mt-4">
          {employees?.length === 0 ? (
            <p className="text-center text-gray-500">No Data</p>
          ) : (
            employees.map((emp) => (
              <div
                key={emp._id}
                className="bg-white rounded-xl p-4 !border !border-gray-200 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.pic || "https://www.gravatar.com/avatar/..."}
                    alt={emp.name || "N/A"}
                    className="!w-12 !h-12 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">
                      {emp.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {emp.role}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Type:</span> {emp.empType}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {emp.phone}
                  </p>
                  <p>
                    <span className="font-medium">Hours:</span>{" "}
                    {emp.workingHoursPerWeek
                      ? emp.workingHoursPerWeek + " Hrs"
                      : "N/A"}
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <PrimaryActionButton
                    onClick={() => openModalForView(emp)}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    View
                  </PrimaryActionButton>
                  <PrimaryActionButton
                    onClick={() => openModalForEdit(emp)}
                    className="text-yellow-600 text-sm font-medium hover:underline"
                  >
                    Edit
                  </PrimaryActionButton>
                  <PrimaryActionButton
                    onClick={() =>
                      Dialog_Boxes.showDeleteConfirmation(() =>
                        deleteEmployee(emp._id)
                      )
                    }
                    className="text-red-600 text-sm font-medium hover:underline"
                  >
                    Delete
                  </PrimaryActionButton>
                </div>
              </div>
            ))
          )}
        </div>

        <PageFooter />
      </div>

      {/* Employee Modal */}
      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          actionType={actionType}
          employeeData={selectedEmployee}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
