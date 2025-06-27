import PropTypes from "prop-types";
import { useSidebarLogic } from "../../hooks/useSidebar";
import { IoArrowForward } from "react-icons/io5";
// import Content from "./components/Content";
// import { Scrollbars } from "react-custom-scrollbars-2";
// import { renderThumb, renderTrack, renderView } from "../scrollbar/Scrollbar";

// const Sidebar = ({ routes }) => {
//   const { memoizedRoutes, sidebarWidth, setIsResizing, resetSidebarWidth } =
//     useSidebarLogic(routes);

//   return (
//     <>
//       {sidebarWidth === 0 && (
//         <div
//           className="absolute top-10 left-0 w-[30px] h-[30px] z-[99] cursor-pointer rounded-[10%] bg-primary"
//           onClick={resetSidebarWidth}
//         >
//           <IoArrowForward className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer" />
//         </div>
//       )}

//       <div
//         className={`relative hidden xl:block`}
//         style={{ width: `${sidebarWidth}px`, maxWidth: "300px" }}
//       >
//         <div
//           className="fixed top-0 left-0 min-h-screen h-full overflow-x-hidden text-white rounded-tr-[30px] rounded-br-[30px] bg-primary "
//           style={{ width: `${sidebarWidth}px`, maxWidth: "300px" }}
//         >
//           <Scrollbars
//             autoHide
//             renderTrackVertical={renderTrack}
//             renderThumbVertical={renderThumb}
//             renderView={renderView}
//           >
//             <Content routes={memoizedRoutes} />
//           </Scrollbars>
//         </div>

//         <div
//           className="absolute top-0 right-0 w-[10px] h-full cursor-ew-resize z-10"
//           onMouseDown={() => setIsResizing(true)}
//         />
//       </div>
//     </>
//   );
// };

// export default Sidebar;

// // // Sidebar component for smaller screens (responsive)
// // export const SidebarResponsive = ({ routes }) => {
// //   const sidebarBackgroundColor = useColorModeValue(
// //     "var(--primary)",
// //     "navy.800"
// //   );
// //   const menuColor = useColorModeValue("white", "white");
// //   const { isOpen, onOpen, onClose } = useDisclosure();
// //   const btnRef = useRef();
// //   const { pathname } = useLocation();

// //   // Memoize routes to avoid unnecessary re-renders
// //   const memoizedRoutes = useMemo(() => routes, [routes]);

// //   // Close the drawer when the pathname changes
// //   useEffect(() => {
// //     onClose();
// //   }, [pathname, onClose]);

// //   return (
// //     <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
// //       <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
// //         <Icon
// //           as={IoMenuOutline}
// //           color={menuColor}
// //           my="auto"
// //           w="40px"
// //           h="40px"
// //           me="10px"
// //           _hover={{ cursor: "pointer" }}
// //         />
// //       </Flex>
// //       <Drawer
// //         isOpen={isOpen}
// //         onClose={onClose}
// //         placement={document.documentElement.dir === "rtl" ? "right" : "left"}
// //         finalFocusRef={btnRef}
// //       >
// //         <DrawerOverlay />
// //         <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
// //           <DrawerCloseButton
// //             zIndex="3"
// //             _focus={{ boxShadow: "none" }}
// //             _hover={{ boxShadow: "none" }}
// //           />
// //           <DrawerBody maxW="285px" px="0rem" pb="0">
// //             <Scrollbars
// //               autoHide
// //               renderTrackVertical={renderTrack}
// //               renderThumbVertical={renderThumb}
// //               renderView={renderView}
// //             >
// //               <Content routes={memoizedRoutes} />
// //             </Scrollbars>
// //           </DrawerBody>
// //         </DrawerContent>
// //       </Drawer>
// //     </Flex>
// //   );
// // };

// // PropTypes validation

// // SidebarResponsive.propTypes = {
// //   routes: PropTypes.arrayOf(PropTypes.object).isRequired,
// // };

// components/Sidebar.jsx

import { SidebarSection } from "./SidebarSection";
import { SidebarLink } from "./SidebarLink";
import { useSelector } from "react-redux";
import { userTypes } from "../../utils/constant";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";

const Sidebar = ({ routes }) => {
  // Fetch user data from the Redux store
  const userData = useSelector((state) => state.userReducer?.data);

  const { memoizedRoutes, sidebarWidth, setIsResizing, resetSidebarWidth } =
    useSidebarLogic(routes);

  return (
    <>
      {sidebarWidth === 0 && (
        <div
          className="absolute top-12 left-0 w-8 h-9 z-[99] cursor-pointer rounded-[10%] bg-primary"
          onClick={resetSidebarWidth}
        >
          <IoArrowForward className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer" />
        </div>
      )}
      <aside
        className="hidden md:block h-screen bg-sidebar shadow-md !border-r pl-6 py-6 overflow-y-auto fixed md:sticky z-100 top-0 left-0 "
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
            {/* Notification */}

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
        {/* Render sidebar sections dynamically from memoizedRoutes */}
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

        {/* Get Pro (Subscription Card)*/}
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidebar;
