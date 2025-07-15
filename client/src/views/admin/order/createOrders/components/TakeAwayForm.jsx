import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTakeAwayInfo } from "../../../../../redux/action/customerInfo";
import { useToast } from "../../../../../contexts/useToast";
import { Input } from "../../../../../components/common/InputField";

const TakeAwayForm = ({ onProceed }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  // Get form data from the Redux store
  const formData = useSelector((state) => state?.customerInfo?.takeAway);
  const { customerName } = formData;

  // Handle input changes and dispatch action to update form data in the Redux store
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch(setTakeAwayInfo({ [name]: value }));
    },
    [dispatch]
  );

  // validate the form data
  const validate = () => {
    if (!customerName || customerName.trim().length < 3) {
      showToast("Please enter customer name with at least 3 chars", "error");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleDineInSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onProceed();
  };

  return (
    <form onSubmit={handleDineInSubmit}>
      <Input
        id="customerName"
        name="customerName"
        type="text"
        label="Customer Name"
        value={customerName}
        onChange={handleChange}
        required
        minLength={3}
        maxLength={50}
      />
      <button
        type="submit"
        className="!mt-2 w-full !bg-primary !text-white rounded-lg !py-2 font-medium hover:!bg-[#5d5fdf] transition"
      >
        Proceed To Menu
      </button>
    </form>
  );
};

TakeAwayForm.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default TakeAwayForm;
