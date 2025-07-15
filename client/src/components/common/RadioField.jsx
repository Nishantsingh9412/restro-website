import PropTypes from "prop-types";

export const RadioGroup = ({
  name,
  label = "Choose option",
  options = [],
  value,
  onChange,
  required = false,
  className = "",
}) => {
  return (
    <div className={`${className} ml-1`}>
      <span className="block mb-1.5 text-sm font-medium text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-gray-700"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              className="accent-light-primary"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.any, label: PropTypes.string })
  ),
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  className: PropTypes.string,
};
