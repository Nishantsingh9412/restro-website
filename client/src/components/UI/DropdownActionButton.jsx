import PropTypes from "prop-types";

/**
 * DropdownActionButton - A reusable button for dropdown action menus.
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} icon - Icon element
 * @param {string} className - Additional classes for styling (color, etc)
 * @param {React.ReactNode} children - Button label
 */
export default function DropdownActionButton({
  onClick,
  icon,
  className = "",
  children,
}) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2  !py-1 hover:bg-gray-100 text-sm ${className} !border-b  `}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}

DropdownActionButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
};
