import PropTypes from "prop-types";
import { Input } from "../../../../../components/common/InputField";
import { RadioGroup } from "../../../../../components/common/RadioField";
import { orderMethods } from "../../../../../utils/constant";
import { useDineInFormLogic } from "../../../../../hooks/forms/useDineInForm";
import { setDineInInfo } from "../../../../../redux/action/customerInfo";

const DineInForm = ({ onProceed }) => {
  const {
    formData,
    customerName,
    specialRequests,
    tableNumber,
    numberOfGuests,
    paymentMethod,
    orderMethod,
    dispatch,
    handleChange,
    handleOrderMethodChange,
    handleGuestNameChange,
    handleSubmit,
  } = useDineInFormLogic(onProceed);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium">
        <Input
          label="Number Of Guests"
          id="numberOfGuests"
          value={numberOfGuests}
          onChange={handleChange}
          type="number"
          min={1}
          max={20}
          required
        />
        <Input
          id="tableNumber"
          type="number"
          label="Table number"
          value={tableNumber}
          onChange={handleChange}
          min={1}
        />
        <RadioGroup
          label="Order Method"
          // required
          name={"orderMethod"}
          options={[
            { value: "individual", label: "Individual" },
            { value: "together", label: "Together" },
          ]}
          value={orderMethod}
          onChange={handleOrderMethodChange}
        />
        <RadioGroup
          label="Payment Method"
          name={"paymentMethod"}
          options={[
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
            { value: "paypal", label: "PayPal" },
          ]}
          value={paymentMethod}
          onChange={(value) => {
            dispatch(setDineInInfo({ paymentMethod: value }));
          }}
        />

        {orderMethod === orderMethods.TOGETHER && (
          <Input
            id="customerName"
            type="text"
            label="Customer Name"
            value={customerName}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={50}
            pattern="^[a-zA-Z\\s]+$"
          />
        )}

        {orderMethod === orderMethods.INDIVIDUAL &&
          numberOfGuests > 1 &&
          Array.from({ length: numberOfGuests }, (_, index) => (
            <Input
              key={index}
              value={formData.guests[index]?.name || ""}
              type="text"
              label={`Enter name for Guest ${index + 1}`}
              onChange={handleGuestNameChange(index)}
              required
              minLength={3}
              maxLength={50}
              pattern="^[a-zA-Z\\s]+$"
            />
          ))}

        <div className="mb-1 md:col-span-2">
          <Input
            id="specialRequests"
            type="text"
            label="Special Requests"
            value={specialRequests}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="submit"
        className="!mt-2 w-full !bg-primary !text-white rounded-lg !py-2 font-medium hover:!bg-[#5d5fdf] transition"
      >
        Proceed To Menu
      </button>

      <div className="text-center">
        {numberOfGuests && numberOfGuests > 0 && numberOfGuests <= 20 ? (
          <img
            src={`/tables/table-${numberOfGuests}.webp`}
            alt={`Table ${numberOfGuests}`}
            className="mx-auto"
          />
        ) : (
          <span className="text-sm mt-3 text-gray-500 block">
            Enter a number of guest (1-20) to see the table layout.
          </span>
        )}
      </div>
    </form>
  );
};

DineInForm.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default DineInForm;
