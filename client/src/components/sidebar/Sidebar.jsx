import { useEffect, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Content from "./components/Content";
import { renderThumb, renderTrack, renderView } from "../scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { IoMenuOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { getLoggedInUserData } from "../../redux/action/user";

// Sidebar component for larger screens
const Sidebar = ({ routes }) => {
  const variantChange = "0.2s linear";
  const sidebarBg = useColorModeValue("var(--primary)", "navy.800");
  const sidebarMargins = "0px";
  const dispatch = useDispatch();
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const role = localData?.result?.role;

  useEffect(() => {
    dispatch(getLoggedInUserData(role));
  }, [dispatch, role]);

  // Memoize routes to avoid unnecessary re-renders
  const memoizedRoutes = useMemo(() => routes, [routes]);

  return (
    <Box
      position="relative"
      w="300px"
      maxW="300px"
      display={{ base: "none", xl: "block" }}
    >
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        maxW="300px"
        minH="100vh"
        h="100%"
        m={sidebarMargins}
        overflowX="hidden"
        color="#fff"
        borderRightRadius="30px"
        position="fixed"
        top="0"
        left="0"
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <Content routes={memoizedRoutes} />
        </Scrollbars>
      </Box>
    </Box>
  );
};

// Sidebar component for smaller screens (responsive)
export const SidebarResponsive = ({ routes }) => {
  const sidebarBackgroundColor = useColorModeValue(
    "var(--primary)",
    "navy.800"
  );
  const menuColor = useColorModeValue("white", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { pathname } = useLocation();

  // Memoize routes to avoid unnecessary re-renders
  const memoizedRoutes = useMemo(() => routes, [routes]);

  // Close the drawer when the pathname changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="40px"
          h="40px"
          me="10px"
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex="3"
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content routes={memoizedRoutes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

// PropTypes validation
Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

SidebarResponsive.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidebar;
