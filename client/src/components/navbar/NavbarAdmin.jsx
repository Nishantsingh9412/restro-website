// // Chakra Imports
// import PropTypes from "prop-types";
// import { useState, useEffect, useCallback } from "react";
// import AdminNavbarLinks from "./NavbarLinksAdmin";
// import profileImg from "../../assets/img/profile/profile.png";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// export default function AdminNavbar({
//   secondary,
//   message,
//   brandText,
//   logoText,
//   fixed,
// }) {
//   const navigate = useNavigate();
//   const [scrolled, setScrolled] = useState(false);
//   const adminData = useSelector((state) => state.userReducer.data);

//   const changeNavbar = useCallback(() => {
//     setScrolled(window.scrollY > 1);
//   }, []);

//   useEffect(() => {
//     window.addEventListener("scroll", changeNavbar);
//     return () => {
//       window.removeEventListener("scroll", changeNavbar);
//     };
//   }, [changeNavbar]);

//   return (
//     <nav
//       className={`w-[90%] mx-auto mt-0 md:mt-4 rounded-[40px] px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between bg-primary shadow-lg transition-all duration-300 z-30 relative ${
//         scrolled ? "shadow-xl" : "shadow-md"
//       }`}
//       style={{
//         position: fixed ? "fixed" : "absolute",
//         top: fixed ? 0 : "20px",
//         right: "5%",
//         left: "5%",
//         filter: "none",
//         backdropFilter: "blur(20px)",
//         border: "1.5px solid transparent",
//       }}
//     >
//       {/* Mobile user info */}
//       <div className="flex items-center justify-between w-full md:hidden mb-2 gap-2">
//         <div className="flex items-center gap-2">
//           <img
//             src={adminData?.profile_picture ?? profileImg}
//             alt="Profile"
//             className="w-12 h-12 rounded-full object-cover"
//           />
//           <div>
//             <div className="text-white text-xs">Hey</div>
//             <div className="text-white font-semibold text-base">
//               {adminData?.username ?? "User"}
//             </div>
//           </div>
//         </div>
//         {/* SidebarResponsive can be added here if needed */}
//       </div>
//       {/* Breadcrumb and Brand (Desktop) */}
//       <div className="hidden md:flex flex-col flex-1">
//         <div className="flex items-center gap-2 text-gray-200 text-xs mb-1">
//           <span>Pages</span>
//           <span className="mx-1">/</span>
//           <span>{brandText}</span>
//         </div>
//         <span className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-tight">
//           {brandText}
//         </span>
//       </div>
//       {/* Navbar Links and Notification */}
//       <div className="flex items-center gap-4 ml-auto">
//         <AdminNavbarLinks
//           logoText={logoText}
//           secondary={secondary}
//           fixed={fixed}
//           scrolled={scrolled}
//         />
//         <button
//           className="relative bg-transparent border-none outline-none cursor-pointer"
//           onClick={() => navigate("notifications")}
//         >
//           <img
//             src="https://img.icons8.com/ios-filled/50/ffffff/appointment-reminders.png"
//             alt="Notifications"
//             className="w-7 h-7"
//           />
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
//             3
//           </span>
//         </button>
//       </div>
//       {secondary && (
//         <div className="w-full text-center text-white mt-2 text-sm">
//           {message}
//         </div>
//       )}
//     </nav>
//   );
// }

// AdminNavbar.propTypes = {
//   brandText: PropTypes.string,
//   secondary: PropTypes.bool,
//   fixed: PropTypes.bool,
//   onOpen: PropTypes.func,
//   logoText: PropTypes.string,
//   message: PropTypes.string,
// };

import { Link } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { FiBell, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/action/authSlice";
import { camelCaseToSentenceCase } from "../../utils/utils";
import { useSidebarContext } from "../../contexts/useSidebar";

export default function Navbar() {
  const dispatch = useDispatch();
  const { openSidebar } = useSidebarContext();
  const { isOpen, ref, onToggle } = useModal();
  const userData = useSelector((state) => state.userReducer.data);

  return (
    <nav className="w-full pl-2 md:px-4 py-3 my-1 flex items-center justify-between gap-4 shadow-2xs bg-sidebar ">
      {/* Search Bar */}
      <div className="hidden md:flex items-center  w-full  bg-gray-100 rounded-md px-4 py-3 text-gray-500 focus-within:outline-none focus-within:ring-1 focus-within:ring-primary hover:bg-[#edf2f2ba] transition-all duration-200">
        <FiSearch className="text-primary w-6 h-6 mr-2" />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none"
        />
      </div>
      {/* Hamburger Menu */}
      <div className="md:hidden bg-primary rounded text-white p-1.5 flex items-center justify-center">
        <button
          className="cursor-pointer active:scale-105 transition-transform"
          onClick={() => openSidebar()}
          ref={ref}
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 mr-2">
        {/* Notification */}
        <Link
          className="relative p-2 hover:scale-105 transition-transform !bg-yellow-50 rounded-md hidden md:block lg:hidden"
          to={"/admin/dashboard/notifications"}
        >
          <FiBell className="text-yellow-500 w-6 h-6" />
          <span className="absolute -top-0 -right-0 text-[10px] bg-red-500 text-white rounded-full text-center px-[6px] py-0.5 font-thin">
            4
          </span>
        </Link>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src={
              // userData?.profile_picture ||
              "https://randomuser.me/api/portraits/men/32.jpg"
            }
            alt="User"
            className="w-10 h-10 rounded-md object-cover"
          />
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-semibold text-gray-800">
              {userData?.username?.slice(0, 8) || "User"}
            </div>
            <div className="text-xs text-slate-500">
              {camelCaseToSentenceCase(userData?.role)}
            </div>
          </div>
          <button
            className={`ml-1 p-1 hover:bg-gray-300 transition cursor-pointer ${
              isOpen ? "rotate-180" : ""
            }`}
            onClick={onToggle}
            ref={ref}
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-4 top-16 bg-white shadow-lg rounded-md w-48 z-50">
          <ul className="py-2 border-b border-gray-200">
            <li>
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:!bg-gray-100"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:!bg-gray-100"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  // Handle logout logic here
                  dispatch(logoutUser());
                  // Clear whole redux store
                  localStorage.removeItem("persist:root");
                  window.location.href = "/";
                  console.log("clieck");
                }}
                to="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:!bg-gray-100"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
