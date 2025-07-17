import React from "react";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getNestedValue } from "../../../../../utils/utils";
import Modal from "../../../../../components/UI/Modal";
import { Input } from "../../../../../components/common/InputField";
import { SelectField } from "../../../../../components/common/SelectField";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import { useEmployeeForm } from "../../../../../hooks/forms/useEmployeeForm";
import {
  actionTypes,
  employeePermissions,
  employeesRoles,
  userTypes,
} from "../../../../../utils/constant";

export default function EmployeeModal({
  isOpen,
  onClose,
  actionType,
  employeeData,
  onSubmit,
}) {
  const {
    userRole,
    formData,
    errors,
    isLoading,
    isChecked,
    handleInputChange,
    handleRadioChange,
    handleToggle,
    handlePhoneInputChange,
    handleSave,
    handleClose,
    showRoleDropdown,
    setShowRoleDropdown,
  } = useEmployeeForm({ actionType, employeeData, onSubmit, onClose });

  // --- Render helpers ---
  const renderInput = ({
    label,
    name,
    type = "text",
    isSelect = false,
    options = [],
    isRequired = false,
    // selectOptions = [],
    ...rest
  }) => (
    <div className="mb-4">
      {isSelect ? (
        <SelectField
          id={name}
          label={`Select ${label.toLowerCase()}`}
          options={options}
          value={getNestedValue(formData, name) || ""}
          onChange={handleInputChange}
          required={isRequired}
          disabled={actionType === actionTypes.VIEW}
          {...rest}
        />
      ) : (
        <Input
          name={name}
          type={type}
          required={isRequired}
          label={label}
          onChange={handleInputChange}
          value={getNestedValue(formData, name) || ""}
          disabled={actionType === actionTypes.VIEW}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
          {...rest}
        />
      )}
      {errors[name] && (
        <div className="text-xs text-red-500 mt-1">{errors[name]}</div>
      )}
    </div>
  );

  const renderPhoneInput = () => (
    <div className="mb-4">
      <PhoneInput
        international
        defaultCountry="DE"
        value={formData.phone}
        inputComponent={CustomInput}
        onChange={handlePhoneInputChange}
        disabled={actionType === actionTypes.VIEW}
        label="Phone number"
        inputProps={{
          name: "phone",
          required: true,
          className: `w-full rounded !px-3 !py-2 text-sm focus
            outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`,
        }}
      />
      {errors.phone && (
        <div className="text-xs text-red-500 mt-1">{errors.phone}</div>
      )}
    </div>
  );

  // --- Modal Body ---
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        actionType === actionTypes.EDIT ? "Edit Employee" : "Add New Employee"
      }
      maxWidth="max-w-md md:max-w-4xl"
      innerClassName="p-6"
      showCloseIcon={true}
    >
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            {renderInput({
              label: "Employee name",
              name: "name",
              type: "text",
              isRequired: true,
            })}
            {renderInput({
              label: "Email",
              name: "email",
              type: "email",
              isRequired: true,
            })}
            {renderPhoneInput()}
            {renderInput({
              label: "Street",
              name: "address.street",
            })}
            {renderInput({
              label: "City",
              name: "address.city",
            })}
            {renderInput({
              label: "Zip code",
              name: "address.zipCode",
              type: "number",
            })}
            {renderInput({
              label: "Birthday (DD-MM-YYYY)",
              name: "birthday",
              type: "date",
            })}
            {renderInput({
              label: "Nationality",
              name: "nationality",
            })}
            {renderInput({
              label: "Marital status",
              name: "maritalStatus",
              isSelect: true,
              options: [
                { value: "Single", label: "Single" },
                { value: "Married", label: "Married" },
                { value: "Divorced", label: "Divorced" },
              ],
            })}
            {renderInput({
              label: "Children",
              name: "childrens",
              type: "number",
            })}
          </div>
          <div>
            {renderInput({
              label: "Date of joining",
              name: "dateOfJoining",
              type: "date",
            })}
            {renderInput({
              label: "End of employment",
              name: "endOfEmployment",
              type: "date",
            })}
            {renderInput({
              label: "Role",
              name: "role",
              isSelect: true,
              isRequired: true,
              options: Object.values(employeesRoles).map((role) => ({
                value: role,
                label: role,
              })),
            })}
            {renderInput({
              label: "Employee type",
              name: "empType",
              isSelect: true,
              isRequired: true,
              options: [
                { value: "Full-Time", label: "Full-Time" },
                { value: "Part-Time", label: "Part-Time" },
                { value: "Contract", label: "Contract" },
              ],
            })}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Working Hours Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="fixed"
                    checked={!formData.variableWorkingHours}
                    onChange={handleRadioChange}
                    disabled={actionType === actionTypes.VIEW}
                  />
                  Fixed
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="variable"
                    checked={formData.variableWorkingHours}
                    onChange={handleRadioChange}
                    disabled={actionType === actionTypes.VIEW}
                  />
                  Variable
                </label>
              </div>
            </div>
            {!formData.variableWorkingHours &&
              renderInput({
                label: "Working Hours (weekly)",
                name: "workingHoursPerWeek",
                type: "number",
              })}
            {renderInput({
              label: "Annual holiday entitlement (days)",
              name: "annualHolidayEntitlement",
              type: "number",
            })}
            {renderInput({
              label: "Health insurance",
              name: "healthInsurance",
            })}
            {renderInput({
              label: "Social security number",
              name: "socialSecurityNumber",
              type: "number",
            })}
            {renderInput({
              label: "Tax ID",
              name: "taxId",
              type: "number",
            })}
            {renderInput({
              label: "Notes",
              name: "notes",
            })}
          </div>
        </div>
        {userRole === userTypes.ADMIN && (
          <div className="relative mt-4 flex items-center">
            <button
              type="button"
              className="flex items-center gap-2 !px-4 !py-2 rounded-md !border !border-gray-300 bg-gray-50 hover:bg-gray-100 font-medium"
              onClick={() => setShowRoleDropdown((v) => !v)}
            >
              <span>Select Role Access</span>
              <IoChevronDownCircleOutline />
            </button>
            {showRoleDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white !border !border-gray-200 rounded shadow-lg px-4 py-2 z-50 min-w-[220px]">
                {employeePermissions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked(option.id)}
                      onChange={() => handleToggle(option.id)}
                      className="accent-blue-500"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-8">
          {actionType !== actionTypes.VIEW && (
            <PrimaryActionButton
              type="submit"
              bgColor={`${isLoading ? "!bg-gray-300" : "!bg-primary"}`}
              disabled={isLoading}
            >
              {actionType === actionTypes.ADD
                ? "Add Employee"
                : "Update Employee"}
            </PrimaryActionButton>
          )}
          <PrimaryActionButton
            type="button"
            onClick={handleClose}
            bgColor="!bg-red-500"
          >
            {actionType === actionTypes.VIEW ? "Close" : "Cancel"}
          </PrimaryActionButton>
        </div>
      </form>
    </Modal>
  );
}

const CustomInput = React.forwardRef(({ inputProps, ...props }, ref) => {
  return <Input ref={ref} {...inputProps} {...props} />;
});
CustomInput.displayName = "CustomInput";

CustomInput.propTypes = {
  inputProps: PropTypes.object,
};

EmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  ref: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  actionType: PropTypes.string.isRequired,
  employeeData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
