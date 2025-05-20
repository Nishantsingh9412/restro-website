import { useSelector } from "react-redux";

// Custom hook to get logged-in user ID and role
export function useUser() {
  const user = useSelector((state) => state.userReducer?.data);
  return {
    userId: user?._id,
    userRole: user?.role,
  };
}
  