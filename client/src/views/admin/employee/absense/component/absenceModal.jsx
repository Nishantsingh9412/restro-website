import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useToast } from "../../../../../contexts/useToast";
import { formatDateForInput } from "../../../../../utils/utils";
import { Input } from "../../../../../components/common/InputField";
import { SelectField } from "../../../../../components/common/SelectField";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";
import Modal from "../../../../../components/UI/Modal";

export default function LeaveRequestModal({
  isOpen,
  onClose,
  modalRef,
  leaveData,
  onSubmit,
  onDelete,
}) {
  const initialFormState = {
    employeeId: "",
    type: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    notes: "",
    declineAssignedShifts: true,
  };

  const showToast = useToast();
  const isEdit = Boolean(leaveData && leaveData._id);
  const [formData, setFormData] = useState(initialFormState);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler
  const handleSave = () => {
    if (!validate()) return;
    onSubmit(formData);
    handleClose();
  };

  // Close and reset
  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  // Validate required fields and date logic
  const validate = () => {
    const { type, leaveType, startDate, endDate } = formData;
    if (!type || !leaveType || !startDate || !endDate) {
      showToast("All required fields must be filled out", "error");
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      showToast("End date must be after start date", "error");
      return false;
    }
    return true;
  };

  // Populate form for edit, or reset for add
  useEffect(() => {
    if (leaveData) {
      setFormData((prev) => ({
        ...prev,
        employeeId: leaveData?.employeeId || "",
        type: leaveData?.type || "",
        leaveType: leaveData?.leaveType || "",
        startDate: formatDateForInput(leaveData?.startDate),
        endDate: formatDateForInput(leaveData?.endDate),
        notes: leaveData?.notes || "",
      }));
    }
  }, [leaveData, isOpen]);

  // Modal is shown/hidden via isOpen prop
  return (
    <Modal
      isOpen={isOpen}
      modalRef={modalRef}
      onClose={handleClose}
      title={"Employee Leave Request"}
      maxWidth="max-w-sm sm:max-w-md"
    >
      {/* Modal Body */}
      <div className="p-4">
        {/* Employee Name (read only) */}
        <Input
          name="name"
          label="Employee Name"
          type="text"
          value={leaveData?.empName || ""}
          readOnly
          className="w-full"
        />
        {/* Vacation Type */}
        <SelectField
          label="Select Vacation Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          options={[
            { value: "Paid vacation", label: "Paid vacation" },
            { value: "Sick leave", label: "Sick leave" },
            { value: "Special leave", label: "Special leave" },
            { value: "Unpaid vacation", label: "Unpaid vacation" },
          ]}
          required
        />

        <SelectField
          label="Select Leave Type"
          name="leaveType"
          value={formData.leaveType}
          onChange={handleInputChange}
          placeholder="Select leave type"
          options={[
            { value: "All Day", label: "All Day" },
            { value: "First Half", label: "First Half" },
            { value: "Second Half", label: "Second Half" },
          ]}
          required
        />
        {/* Start and End Date */}
        <div className="flex gap-3">
          <Input
            type="date"
            name="startDate"
            label="Leave Start Date"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            className="w-full"
          />

          <Input
            type="date"
            name="endDate"
            label="Leave End Date"
            value={formData.endDate}
            onChange={handleInputChange}
            required
            className="w-full"
          />
        </div>
        {/* Notes */}
        <Input
          label="Notes"
          name="notes"
          type="text"
          value={formData.notes}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end gap-2 px-4 pb-4">
        {isEdit && (
          <PrimaryActionButton
            bgColor="!bg-red-500 hover:!bg-red-600"
            onClick={() => onDelete(leaveData?._id)}
          >
            Delete
          </PrimaryActionButton>
        )}

        <PrimaryActionButton onClick={handleSave}>Save</PrimaryActionButton>
      </div>
    </Modal>
  );
}

LeaveRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalRef: PropTypes.any,
  leaveData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
