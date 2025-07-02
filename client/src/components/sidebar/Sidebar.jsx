import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { useSelector } from "react-redux";
import { SidebarLink } from "./SidebarLink";
import { userTypes } from "../../utils/constant";
import { IoArrowForward } from "react-icons/io5";
import { SidebarSection } from "./SidebarSection";
import { useSidebarLogic } from "../../hooks/useSidebar";
import { useSidebarContext } from "../../contexts/useSidebar";

const Sidebar = ({ routes }) => {
  const { isSidebarOpen, sidebarRef } = useSidebarContext();
  const userData = useSelector((state) => state.userReducer?.data);

  const { memoizedRoutes, sidebarWidth, setIsResizing, resetSidebarWidth } =
    useSidebarLogic(routes);

  return (
    <>
      {sidebarWidth === 0 && (
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
          fixed md:sticky top-0 left-0 z-100 h-screen bg-sidebar shadow-md !border-r pl-6 py-6 overflow-y-auto
          transition-all duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          }
          md:translate-x-0 md:opacity-100 md:pointer-events-auto
        `}
        style={{ width: `${sidebarWidth}px`, maxWidth: "275px" }}
      >
        {userData?.role === userTypes.ADMIN && (
          <div className="flex items-center mb-6 mx-auto">
            <Link
              className="relative p-2 hover:scale-105 transition-transform !border-2 rounded-xl !border-primary"
              to={"/admin/dashboard/notifications"}
            >
              <FiBell className="text-primary w-5 h-5" />
              <span className="absolute -top-0 -right-0 text-[10px] bg-red-500 text-white rounded-full text-center px-[6px] py-0.5 font-thin">
                4
              </span>
            </Link>
            <div className="ml-2 ">
              <p
                className={`font-semibold leading-tight transition-all duration-200 ${
                  sidebarWidth > 240 ? "text-lg" : "text-base"
                } `}
              >
                Membership ID:
              </p>
              <p
                className={` font-bold text-primary leading-tight transition-all duration-200 ${
                  sidebarWidth > 240 ? "text-sm" : "text-xs"
                }`}
              >
                {userData?.uniqueId?.toUpperCase() || "N/A"}
              </p>
            </div>
          </div>
        )}
        {memoizedRoutes?.map((section, idx) => (
          <SidebarSection
            key={section?.name || idx}
            title={section?.name}
            icon={section?.icon}
            path={section?.path}
          >
            {section?.links?.map((link) => (
              <SidebarLink
                key={link?.name || link?.path || link?.name}
                to={section?.layout + link?.path}
                icon={link?.icon}
                label={link?.name}
              />
            ))}
          </SidebarSection>
        ))}
        <div
          className="absolute top-0 right-0 w-[10px] h-full cursor-ew-resize z-10"
          onMouseDown={() => setIsResizing(true)}
        />
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidebar;
