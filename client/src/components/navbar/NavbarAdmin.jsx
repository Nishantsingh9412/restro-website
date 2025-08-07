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
