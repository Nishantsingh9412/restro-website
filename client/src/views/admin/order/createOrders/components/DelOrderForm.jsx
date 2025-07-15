import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import MapInput from "../../../../../components/mapInput/MapInput";
import { setDeliveryInfo } from "../../../../../redux/action/customerInfo";
import { Input } from "../../../../../components/common/InputField";
import { RadioGroup } from "../../../../../components/common/RadioField";
import { useDeliveryOrderFormLogic } from "../../../../../hooks/forms/uesDeliveryForm";

const DeliveryOrderForm = ({ onProceed }) => {
  const dispatch = useDispatch();
  const { isOpen, formData, setIsOpen, handleChange, handleAddressSubmit } =
    useDeliveryOrderFormLogic(onProceed);

  return (
    <form onSubmit={handleAddressSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium">
        <Input
          id="customerName"
          name="customerName"
          label="Customer Name"
          value={formData.customerName}
          onChange={handleChange}
          required
          maxLength={50}
          minLength={3}
        />
        <Input
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          type="text"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          pattern="^\d{11}$"
          title="Please enter a valid 11 digit phone number"
          maxLength={11}
          minLength={11}
        />
        <RadioGroup
          name="paymentMethod"
          label="Payment Method"
          options={[
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
            { value: "paypal", label: "PayPal" },
          ]}
          value={formData.paymentMethod}
          onChange={(val) => dispatch(setDeliveryInfo({ paymentMethod: val }))}
        />
        {/* Drop Location (Map) */}
        <div className="flex flex-col gap-1 mb-2">
          <label
            className="font-medium text-sm text-gray-600"
            htmlFor="dropLocation"
          >
            Drop Location <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {formData.dropLocationName && (
              <span className="flex-1 text-xs text-gray-600 truncate bg-gray-100 px-1 py-1 rounded">
                {formData.dropLocationName}
              </span>
            )}
            <button
              type="button"
              aria-label="Open Map"
              className="flex-1 px-4 !py-0 rounded !bg-[#029CFF] !text-white hover:!bg-blue-500 transition"
              onClick={() => setIsOpen(true)}
            >
              Select on Map
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="col-span-1 md:col-span-2">
            <MapInput
              data={{
                dropLocation: formData.dropLocation,
                dropLocationName: formData.dropLocationName || "",
              }}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
        )}
        <Input
          id="address"
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          required
          maxLength={100}
          minLength={8}
        />
        <Input
          id="city"
          name="city"
          label="City"
          value={formData.city}
          onChange={handleChange}
          maxLength={20}
          minLength={3}
        />
        <Input
          id="zip"
          name="zip"
          label="Zip"
          type="text"
          value={formData.zip}
          onChange={handleChange}
          required
          pattern="^\d{5}$"
          title="Please enter a valid 5 digit zip code"
          maxLength={5}
          minLength={5}
        />

        <Input
          id="noteFromCustomer"
          name="noteFromCustomer"
          label="Note from Customer"
          value={formData.noteFromCustomer}
          onChange={handleChange}
          as="textarea"
        />
      </div>

      <button
        type="submit"
        className="!mt-4 w-full !bg-primary !text-white rounded-lg !py-2 font-medium hover:!bg-[#5d5fdf] transition"
      >
        Proceed To Menu
      </button>
    </form>
  );
};

DeliveryOrderForm.propTypes = {
  onProceed: PropTypes.func.isRequired,
};

export default DeliveryOrderForm;
