// Chakra Imports
import {
  Avatar,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { FaEthereum } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/action/auth.js";
import RestaurantModal from "../restaurant/RestaurantModal.jsx";
import { localStorageData } from "../../utils/constant.js";
export default function HeaderLinks({ secondary }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isOpen: isRestaurantModalOpen,
    onOpen: onRestaurantModalOpen,
    onClose: onRestaurantModalClose,
  } = useDisclosure();

  // Fetching local data from local storage and handling potential parsing errors
  const localData = (() => {
    try {
      return JSON.parse(localStorage.getItem(localStorageData.PROFILE_DATA));
    } catch (error) {
      console.error("Failed to parse local storage data:", error);
      return null;
    }
  })();

  // Getting user data from the Redux store
  const singleUserData = useSelector((state) => state.userReducer.data);

  // Chakra UI color mode values
  const menuBg = useColorModeValue("white", "navy.800");
  const ethColor = useColorModeValue("gray.700", "white");
  const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
  const ethBox = useColorModeValue("white", "navy.800");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  // Handle user logout
  const handleLogout = () => {
    dispatch(logoutUser());
    console.log("Logged out");
    navigate("/");
  };

  // Effect to handle user data fetching and token expiration
  useEffect(() => {
    if (localData) {
      // Dispatch action to fetch single user data

      const token = localData?.token;
      if (token) {
        const decodedToken = jwtDecode(token);
        // Logout if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          handleLogout();
        }
      }
    } else {
      // Redirect if localData is not available
      navigate("/");
    }
  }, [dispatch, localData, navigate]); // Added localData to dependencies

  return (
    <>
      <Flex
        w={{ sm: "100%", md: "auto" }}
        alignItems="center"
        flexDirection="row"
        flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
        p="10px"
        borderRadius="30px"
        boxShadow={shadow}
      >
        {/* Ethereum Info Box */}
        <Flex
          bg={ethBg}
          display={secondary ? "flex" : "none"}
          borderRadius="30px"
          ms="auto"
          p="6px"
          align="center"
          me="6px"
        >
          <Flex
            align="center"
            justify="center"
            bg={ethBox}
            h="29px"
            w="29px"
            borderRadius="30px"
            me="7px"
          >
            <Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
          </Flex>
          <Text
            w="max-content"
            color={ethColor}
            fontSize="sm"
            fontWeight="700"
            me="6px"
          >
            1,924
            <Text as="span" display={{ base: "none", md: "unset" }}>
              {" "}
              ETH
            </Text>
          </Text>
        </Flex>

        {/* User Menu */}
        <Menu>
          <MenuButton p="0px">
            <Avatar
              _hover={{ cursor: "pointer" }}
              color="white"
              name={singleUserData?.username || "User"}
              bg="#11047A"
              size="sm"
              w="40px"
              h="40px"
            />
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={"black"}
              >
                👋&nbsp; Hey, {singleUserData?.username || "User"}
              </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
              {!singleUserData?.isVerified && (
                <MenuItem
                  _hover={{ bg: "none" }}
                  _focus={{ bg: "none" }}
                  color="blue.400"
                  borderRadius="8px"
                  px="14px"
                  onClick={onRestaurantModalOpen}
                >
                  <Text fontSize="sm">Verify Restaurant</Text>
                </MenuItem>
              )}
              <MenuItem
                _hover={{ bg: "none" }}
                _focus={{ bg: "none" }}
                color="red.400"
                borderRadius="8px"
                px="14px"
                onClick={handleLogout}
              >
                <Text fontSize="sm">Log out</Text>
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      </Flex>
      {/* // Restaurant Modal */}
      {isRestaurantModalOpen && (
        <RestaurantModal
          isOpen={isRestaurantModalOpen}
          onClose={onRestaurantModalClose}
          onSubmit={(data) => console.log(data)}
        />
      )}
    </>
  );
}

// PropTypes validation
HeaderLinks.propTypes = {
  secondary: PropTypes.bool,
};
