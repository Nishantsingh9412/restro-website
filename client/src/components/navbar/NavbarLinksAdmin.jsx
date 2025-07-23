// Chakra Imports
// import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/action/authSlice.js";
import RestaurantModal from "../restaurant/RestaurantModal.jsx";

export default function HeaderLinks({ secondary }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRestaurantModalOpen, setRestaurantModalOpen] = useState(false);

  // Getting user data from the Redux store
  const singleUserData = useSelector((state) => state.userReducer.data);

  console.log("Single User Data:", singleUserData);

  // Handle user logout
  const handleLogout = () => {
    console.log("cleidkced");
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <>
      <div
        className={`flex items-center ${
          secondary ? "flex-wrap md:flex-nowrap" : ""
        } p-2 rounded-2xl shadow-md bg-white/90 dark:bg-navy-800`}
      >
        {/* User Menu */}
        <div className="relative group">
          <button
            className="p-0 focus:outline-none"
            onClick={() => setRestaurantModalOpen((v) => !v)}
          >
            <img
              src={"https://ui-avatars.com/api/?name=User"}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary hover:shadow-lg transition"
            />
          </button>
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 hidden group-focus-within:block group-hover:block">
            <div className="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-sm font-bold !text-gray-800 dark:text-white">
              👋&nbsp; Hey, {singleUserData?.username || "User"}
            </div>
            <div className="flex flex-col p-2">
              {!singleUserData?.isVerified && (
                <button
                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-navy-700 rounded-md px-3 py-2 text-sm text-left"
                  onClick={() => setRestaurantModalOpen(true)}
                >
                  Verify Restaurant
                </button>
              )}
              <button
                className="text-red-500 hover:bg-red-50 dark:hover:bg-navy-700 rounded-md px-3 py-2 text-sm text-left"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Restaurant Modal */}
      {isRestaurantModalOpen && (
        <RestaurantModal
          isOpen={isRestaurantModalOpen}
          onClose={() => setRestaurantModalOpen(false)}
          onSubmit={(data) => console.log(data)}
        />
      )}
    </>
  );
}

HeaderLinks.propTypes = {
  secondary: PropTypes.bool,
};
