import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { formatDateForInput } from "../../../../../utils/utils";
import { useToast } from "../../../../../contexts/useToast";
import Modal from "../../../../../components/UI/Modal";
import { Input } from "../../../../../components/common/InputField";
import { SelectField } from "../../../../../components/common/SelectField";
import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";

function formatTimeForInput(time) {
  if (!time) return "";
  const newTime = new Date(time);
  const formattedTime = newTime.toISOString().slice(11, 16);
  return formattedTime;
}

// Generate Time to Select Hours
const timesList = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

const ShiftModal = ({
  isOpen,
  onClose,
  modalRef,
  shiftData,
  onSubmit,
  handleDeleteShift,
  isSubmitting,
}) => {
  const initialFormState = {
    employeeId: null,
    from: "",
    to: "",
    note: "",
    date: "",
  };
  const showToast = useToast();
  const { employeeId, from, to, note, date, empName } = shiftData || {};
  const [formData, setFormData] = useState(initialFormState);
  const isEditMode = Boolean(shiftData && shiftData._id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate the form data
  const validate = () => {
    const { employeeId, from, to, date } = formData;

    if (!date || !employeeId || !from || !to) {
      showToast("All fields are required", "error");
      return false;
    }
    //Check the date is after today or not
    const today = new Date();
    const tomorrowsDate = today.setDate(today.getDate() + 1);

    const selectedDate = new Date(date);
    if (selectedDate < tomorrowsDate) {
      showToast("The selected date cannot be in the past.", "error");
      return false;
    }

    // Check if the shift duration is at least 1 hour
    const fromTime = new Date(`1970-01-01T${from}:00`);
    const toTime = new Date(`1970-01-01T${to}:00`);
    if ((toTime - fromTime) / (1000 * 60 * 60) < 1) {
      showToast("The shift duration must be at least 1 hour.", "error");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(formData);
  };

  // SetFormData for edit mode
  useEffect(() => {
    if (shiftData) {
      setFormData({
        employeeId: employeeId || "",
        from: formatTimeForInput(from) || "",
        to: formatTimeForInput(to) || "",
        note: note || "",
        date: formatDateForInput(date) || "",
      });
    } else {
      setFormData(initialFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftData]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Schedule Shift"}
      modalRef={modalRef}
    >
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="empName"
            value={empName}
            readOnly
            className="w-full"
            label="Employee Name"
          />
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full"
            required
            label="Enter Date"
          />
          <SelectField
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="w-full"
            required
            label="From Time"
            options={timesList.map((time) => ({
              value: time,
              label: time,
            }))}
          />
          <SelectField
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="w-full"
            required
            label="To Time"
            options={timesList.map((time) => ({
              value: time,
              label: time,
            }))}
          />
          <Input
            type="text"
            name="note"
            label="Notes"
            value={formData.note}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-end gap-2 mt-6">
            <PrimaryActionButton
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? "!bg-blue-300 cursor-not-allowed" : ""}
            >
              {isEditMode ? "Update" : "Add Shift"}
            </PrimaryActionButton>
            {isEditMode && (
              <PrimaryActionButton
                type="button"
                bgColor="!bg-red-500 hover:!bg-red-600"
                onClick={() => handleDeleteShift(shiftData?._id)}
              >
                Delete
              </PrimaryActionButton>
            )}
            <PrimaryActionButton
              bgColor="!bg-red-500"
              textColor="!text-gray-700"
              onClick={onClose}
            >
              Cancel
            </PrimaryActionButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

ShiftModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  shiftData: PropTypes.object,
  modalRef: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
  handleDeleteShift: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

export default ShiftModal;
