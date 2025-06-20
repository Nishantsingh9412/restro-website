import PropTypes from "prop-types";

export const SidebarSection = ({ title, icon, path, children }) => {
  // Function to check if the current route includes the given route name
  const includeActiveRoute = () => {
    return window.location.pathname.includes(
      path ? path?.toLowerCase() : title?.toLowerCase()
    );
  };

  return (
    <div className="my-5">
      {title && (
        <div
          className={`inline-flex items-center h-10 rounded-xl shadow-sm mb-2 px-4 space-x-2 text-primary !border !border-primary ${
            includeActiveRoute() ? "bg-primary text-white" : ""
          }`}
        >
          <div className="w-10 flex items-center justify-center text-xl">
            {icon || title?.charAt(0).toUpperCase()}
          </div>
          <h4 className="whitespace-nowrap !font-medium">{title}</h4>
        </div>
      )}
      <div className="flex flex-col space-y-0.5 ml-1">{children}</div>
    </div>
  );
};

SidebarSection.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
};
