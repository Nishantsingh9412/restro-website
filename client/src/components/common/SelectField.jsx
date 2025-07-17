import PropTypes from "prop-types";
import { FaArrowDown } from "react-icons/fa6";

export const SelectField = ({
  id = "",
  label = "Select option",
  options = [],
  value,
  onChange,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`relative w-full mb-2 ${className}`}>
      <select
        id={id}
        name={id}
        aria-label={label}
        value={value}
        onChange={onChange}
        required={required}
        className="peer w-full !p-2 !pr-10 !border !border-gray-300 rounded-md bg-white text-lg text-black appearance-none focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
        {...props}
      >
        <option value={label.toLowerCase()}>{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom arrow icon on the right */}
      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
        <FaArrowDown />
      </div>
    </div>
  );
};

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.any, label: PropTypes.string })
  ),
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  className: PropTypes.string,
};
