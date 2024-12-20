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
import { jwtDecode } from "jwt-decode";
import { SearchBar } from "../../components/navbar/searchBar/SearchBar.jsx";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import { FaEthereum } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getSingleDelBoyAction,
  changeDelBoyStatusAction,
} from "../../redux/action/delboy.js";

import { logoutUser } from "../../redux/action/auth.js";

export default function HeaderLinks({ secondary }) {
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
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const singleUserData = useSelector((state) => state.delBoyReducer.delBoyUser);
  const [isOnline, setIsOnline] = useState(true);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    navigate("/");
  }, [dispatch, navigate]);

  const handleToggleStatus = (e) => {
    e.preventDefault();
    const newStatus = e.target.checked;
    setIsOnline(newStatus); // Update local state immediately
    dispatch(
      changeDelBoyStatusAction(
        singleUserData?._id || localData?._id || localData?.result?._id,
        { isOnline: newStatus }
      )
    );
  };

  useEffect(() => {
    if (localData?.result?._id) {
      dispatch(getSingleDelBoyAction(localData.result._id));
    }
  }, [dispatch, localData?.result?._id, singleUserData?.isOnline]);

  useEffect(() => {
    setIsOnline(singleUserData?.isOnline || false);
  }, [singleUserData]);

  useEffect(() => {
    if (!localData) {
      navigate("/");
    }
  }, [localData, navigate]);

  useEffect(() => {
    const token = localData?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
  }, [handleLogout, localData?.token]);

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
      <SearchBar
        mb={secondary ? { base: "10px", md: "unset" } : "unset"}
        me="10px"
        borderRadius="30px"
      />
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
              👋&nbsp; Hey, {singleUserData?.name ?? "Employee"}
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
