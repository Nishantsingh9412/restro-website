// components/SidebarLink.jsx
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useSidebarContext } from "../../contexts/useSidebar";
export const SidebarLink = ({
  to,
  icon,
  label = "Link",
  hideLabel = false,
  tooltip,
}) => {
  const location = useLocation();
  const { closeSidebar } = useSidebarContext();

  // Function to check if the current route is active
  const isActive = (() => {
    return location.pathname === to;
  })();

  return (
    <div
      className={`flex items-center justify-between ${
        hideLabel ? "justify-between ml-1  mb-0.5 w-12" : "mb-2"
      }`}
      onClick={closeSidebar}
    >
      <NavLink
        to={to}
        className={`flex items-center gap-3 px-4 py-1.5 rounded-lg text-sm transition-colors w-[calc(100%-1rem)]
        ${
          isActive
            ? "bg-blue-100 !text-primary outline-1 font-medium"
            : "!text-[#636363] hover:!bg-gray-200"
        }
        ${hideLabel ? "justify-center !w-6 h-8 !text-xl" : ""}`}
        title={tooltip}
        style={hideLabel ? { justifyContent: "center" } : {}}
      >
        <div className="w-5 md:w-10 lg:w-5 flex items-center justify-center md:text-xl lg:text-lg">
          {icon}
        </div>
        {!hideLabel && <p className="text-sm">{label}</p>}
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
  hideLabel: PropTypes.bool,
  tooltip: PropTypes.string,
};
