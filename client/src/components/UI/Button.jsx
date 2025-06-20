import PropTypes from "prop-types";

export const Button = ({ label, variant = "primary" }) => {
  const base = "px-4 py-2 rounded-lg font-semibold transition-all duration-200";
  const styles = {
    primary: `${base} bg-blue-600 text-white hover:bg-blue-700`,
    outline: `${base} border border-blue-600 text-blue-600 hover:bg-blue-50`,
    danger: `${base} bg-red-500 text-white hover:bg-red-600`,
  };

  return <button className={styles[variant]}>{label}</button>;
};

Button.propTypes = {
  label: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
};

Button.defaultProps = {
  variant: "primary",
};
