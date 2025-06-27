import PropTypes from "prop-types";

export const PrimaryButton = ({
  label,
  onClick,
  variant = "primary",
  leftIcon,
  rightIcon,
  className = "",
  type = "button",
  disabled = false,
  ...rest
}) => {
  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400";
  const styles = {
    primary: `${base} bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300`,
    outline: `${base} border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:bg-blue-100`,
    danger: `${base} bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300`,
    secondary: `${base} bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:bg-gray-200`,
  };

  return (
    <button
      type={type}
      className={`${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {leftIcon && <span className="mr-1 flex items-center">{leftIcon}</span>}
      <span>{label}</span>
      {rightIcon && <span className="ml-1 flex items-center">{rightIcon}</span>}
    </button>
  );
};

PrimaryButton.propTypes = {
  label: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger"]),
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
};

PrimaryButton.defaultProps = {
  variant: "primary",
  type: "button",
  disabled: false,
};
