import { useEffect, useRef, useCallback, useMemo } from "react";
import { Box, Flex, Img } from "@chakra-ui/react";
import { FaPencil } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
// import {
//   // singleUserDataAction,
//   updateProfilePicAction,
// } from "../../../redux/action/user";

// import { getAdminData } from "../../../redux/action/admin";
import {
  getLoggedInUserData,
  updateProfilePicAction,
} from "../../../redux/action/user";

// SidebarBrand component
export function SidebarBrand() {
  // Reference to the file input element
  const fileInputRef = useRef(null);
  // Redux dispatch function
  const dispatch = useDispatch();
  // Retrieve local profile data from localStorage
  const localData = useMemo(
    () => JSON.parse(localStorage.getItem("ProfileData")),
    []
  );
  const role = localData?.result?.role;
  // Retrieve user profile data from Redux store
  const userProfileData = useSelector((state) => state?.userReducer?.data);
  // const adminData = useSelector((state) => state?.admin?.data);
  // const employeeData = useSelector((state) => state?.employee?.data);
  // const userProfileData = adminData || employeeData;

  // Function to handle profile picture update click
  const handleProfilePicUpdate = useCallback(() => {
    fileInputRef.current.click();
    console.log("clicked");
  }, []);

  // Function to handle file input change
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("role", role);
        // Dispatch action to update profile picture
        dispatch(updateProfilePicAction(formData)).then((res) => {
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        });
      }
    },
    [dispatch]
  );

  // Fetch user data on component mount
  useEffect(() => {
    // dispatch(singleUserDataAction(user_id));
    dispatch(getLoggedInUserData(role));
  }, []);

  // Memoized function to get the profile picture URL
  const ImageUrl = useMemo(() => {
    if (userProfileData?.profile_picture?.includes("http")) {
      return userProfileData.profile_picture;
    }
    const baseUrl = import.meta.env.VITE_APP_BASE_URL_FOR_APIS;
    return `${baseUrl}/uploads/${userProfileData?.profile_picture}`;
  }, [userProfileData]);

  return (
    <Flex align="center" direction="column" justifyContent="center" gap="20px">
      <Box>
        {/* Toast notifications container */}
        <ToastContainer />
        {/* Profile picture */}
        <Img src={ImageUrl} w="100px" h="100px" borderRadius="full" />
        {/* Edit profile picture icon */}
        <Box
          mt={-5}
          color={["#fff", "#fff", "var(--primary)"]}
          display="flex"
          justifyContent="center"
          cursor="pointer"
          onClick={handleProfilePicUpdate}
        >
          <FaPencil />
        </Box>
        {/* Hidden file input for profile picture upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/*"
        />
      </Box>
      {/* Membership ID display */}
      <Box
        display="flex"
        flexDirection="column"
        fontSize="larger"
        fontWeight="500"
      >
        Membership Id
        <Box letterSpacing="2px">{userProfileData?.uniqueId}</Box>
      </Box>
      {/* Buttons for Favourites and Recently */}
      {/* <Flex alignItems="center" justifyContent="space-between">
        <Button bg="var(--primary)" color="#fff">
          Favourites
        </Button>
        <Button bg="var(--primary)" color="#fff">
          Recently
        </Button>
      </Flex> */}
    </Flex>
  );
}

export default SidebarBrand;
