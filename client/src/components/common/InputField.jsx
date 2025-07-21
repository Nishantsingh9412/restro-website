import PropTypes from "prop-types";

export const Input = ({
  id = "",
  label = "Enter value",
  type = "text",
  className = "",
  value,
  onChange,
  required = false,
  ...props
}) => {
  return (
    <div className="relative w-full mb-3">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        className={`peer w-full !px-3 !py-2 !border !border-gray-300 rounded-md bg-transparent text-lg text-black focus:outline-none focus:ring-1 focus:ring-primary  transition-all duration-200 ${className}`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base bg-white px-0.5 transition-all duration-200
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
          peer-focus:top-0 peer-focus:text-sm peer-focus:text-primary tracking-[0.2px] cursor-text
          ${value ? "!top-0 text-sm text-primary" : ""}
          pointer-events-none
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};
