// components/SidebarLink.jsx
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
export const SidebarLink = ({ to, icon, label = "Link" }) => {
  const location = useLocation();
  // Function to check if the current route is active
  const isActive = (() => {
    return location.pathname === to;
  })();

  return (
    <div className="flex items-center mb-2 justify-between ">
      <NavLink
        to={to}
        className={`flex items-center gap-3 px-4 py-1.5 rounded-lg text-sm transition-colors w-[calc(100%-1rem)]
        ${
          isActive
            ? "bg-blue-100 !text-primary outline-1 font-medium"
            : "!text-[#636363] hover:!bg-gray-200"
        }`}
      >
        {icon}
        {label}
      </NavLink>
      {isActive ? (
        <div className="w-2 h-8 bg-primary rounded-l-2xl"></div>
      ) : null}
    </div>
  );
};

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};
