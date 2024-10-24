// Chakra Imports
import {
  Avatar,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode"; // Corrected import
// Custom Components
import { SearchBar } from "../../components/navbar/searchBar/SearchBar.jsx";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
// Assets
import { FaEthereum } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getSingleDelBoyAction,
  updateSingleDelBoyAction,
} from "../../redux/action/delboy.js";

export default function HeaderLinks({ secondary }) {
  // Chakra Color Mode
  const menuBg = useColorModeValue("white", "navy.800");
  const ethColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
  const ethBox = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve local data from localStorage
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const singleUserData = useSelector((state) => state.delBoyReducer.delBoyUser);
  const [isOnline, setIsOnline] = useState(true);

  // Handle user logout
  const handleLogout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  }, [dispatch, navigate]);

  // Handle toggle status for delivery boy
  const handleToggleStatus = (e) => {
    e.preventDefault();
    dispatch(
      updateSingleDelBoyAction(
        singleUserData?._id || localData?._id || localData?.result?._id,
        { isOnline: e.target?.checked || false }
      )
    );
  };

  // Fetch single delivery boy data on component mount
  useEffect(() => {
    if (localData?.result?._id) {
      dispatch(getSingleDelBoyAction(localData.result._id));
    }
  }, [dispatch, localData?.result?._id]);

  // Update online status based on fetched user data
  useEffect(() => {
    setIsOnline(singleUserData?.isOnline || false);
  }, [singleUserData]);

  // Redirect to home if no local data is found
  useEffect(() => {
    if (!localData) {
      navigate("/");
    }
  }, [localData, navigate]);

  // Check token expiration and logout if expired
  useEffect(() => {
    const token = localData?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
  }, [dispatch, handleLogout, localData?.token]);

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      {/* Search Bar Component */}
      <SearchBar
        mb={secondary ? { base: "10px", md: "unset" } : "unset"}
        me="10px"
        borderRadius="30px"
      />
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
      <Menu closeOnSelect={false}>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={singleUserData?.user?.name}
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
              👋&nbsp; Hey, {singleUserData?.user?.name}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              bg={"transparent"}
            >
              <Text fontSize={"sm"}>Receive Deliveries</Text>
              <Switch isChecked={isOnline} onChange={handleToggleStatus} />
            </MenuItem>
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
  );
}

HeaderLinks.propTypes = {
  secondary: PropTypes.bool,
};
