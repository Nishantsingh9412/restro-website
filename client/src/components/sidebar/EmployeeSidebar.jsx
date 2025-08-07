import PropTypes from "prop-types";
import { IoArrowForward } from "react-icons/io5";
import { SidebarSection } from "./SidebarSection";
import { useSidebarLogic } from "../../hooks/useSidebar";
import { useSidebarContext } from "../../contexts/useSidebar";
import { useScreen } from "../../hooks/useScreen";
import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineViewSidebar } from "react-icons/md";

const EmployeeSidebar = ({ routes }) => {
  const { isTablet } = useScreen();
  const { isSidebarOpen, sidebarRef } = useSidebarContext();
  const { memoizedRoutes, sidebarWidth, setIsResizing, resetSidebarWidth } =
    useSidebarLogic(routes);

  // Tablet: auto-width, icon-only
  const tabletSidebarStyle = isTablet
    ? {
        width: "auto",
        minWidth: "64px",
        maxWidth: "80px",
        paddingLeft: 0,
        paddingRight: 0,
      }
    : { width: `${sidebarWidth}px`, maxWidth: "275px" };

  return (
    <>
      {sidebarWidth === 0 && !isTablet && (
        <div
          className="absolute top-12 left-0 w-6 h-6 z-[199] cursor-pointer rounded-[10%] bg-primary"
          onClick={resetSidebarWidth}
        >
          <IoArrowForward className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer" />
        </div>
      )}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:sticky top-0 left-0 z-100 h-screen bg-[#a2a1a146] shadow-md !border-r py-6 overflow-y-auto
          transition-all duration-300 ease-in-out  ${
            isSidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          }
          md:translate-x-0 md:opacity-100 md:pointer-events-auto
          ${isTablet ? "pl-0 pr-0 flex flex-col items-center" : "pl-6"}
        `}
        style={tabletSidebarStyle}
      >
        <div className="flex justify-between items-center mr-4">
          <h3 className="!font-semibold">TURGASTRO</h3>
          <MdOutlineViewSidebar
            className="bg-[#8b8a8a47] rounded-lg rotate-180 text-[#737272] w-8 h-8 !py-1.5 cursor-pointer"
            onClick={resetSidebarWidth}
          />
        </div>
        {memoizedRoutes?.map((section, idx) => (
          <SidebarSection key={section?.name || idx} isShow={false}>
            {section?.links?.map((link) => (
              <SidebarLink
                key={link?.name || link?.path || link?.name}
                to={section?.layout + link?.path}
                icon={link?.icon}
                label={link?.name}
                hideLabel={isTablet}
                tooltip={isTablet ? link?.name : undefined}
              />
            ))}
          </SidebarSection>
        ))}
        {!isTablet && (
          <div
            className="absolute top-0 right-0 w-[10px] h-full cursor-ew-resize z-10"
            onMouseDown={() => setIsResizing(true)}
          />
        )}
      </aside>
    </>
  );
};

EmployeeSidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EmployeeSidebar;

// components/SidebarLink.jsx
const SidebarLink = ({
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
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors w-[calc(100%-1rem)]
        ${
          isActive
            ? "!bg-[#8b8a8a29]  !text-[#737272] font-medium"
            : "!text-[#636363] hover:!bg-[#8b8a8a29]"
        }
        ${hideLabel ? "justify-center !w-6 h-8 !text-xl" : ""}`}
        title={tooltip}
        style={hideLabel ? { justifyContent: "center" } : {}}
      >
        <div className="w-5 md:w-10 lg:w-5 flex items-center justify-center md:text-xl lg:text-lg px-4 py-2 bg-[#8b8a8a47] rounded-lg">
          {icon}
        </div>
        {!hideLabel && <p className="text-sm">{label}</p>}
      </NavLink>
      {/* {isActive ? (
        <div className="w-2 h-8 bg-primary rounded-l-2xl"></div>
      ) : null} */}
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
