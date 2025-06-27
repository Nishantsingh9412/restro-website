import PropTypes from "prop-types";

/**
 * PrimaryActionButton - A reusable button for primary actions (e.g., Open Scanner, Add Item).
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} icon - Icon element (optional)
 * @param {string} className - Additional classes for styling
 * @param {React.ReactNode} children - Button label
 */
export default function PrimaryActionButton({
  onClick,
  className = "",
  children,
}) {
  return (
    <button
      type="button"
      className={`!bg-primary !text-white !px-2 md:!px-4 !py-2 rounded flex items-center gap-2 ${className} !text-xs md:!text-sm`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

PrimaryActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
