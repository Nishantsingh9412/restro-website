import { useEffect, useRef } from "react";
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

// Sidebar component for larger screens
const Sidebar = ({ routes }) => {
  const variantChange = "0.2s linear"; // Transition effect for sidebar
  const sidebarBg = useColorModeValue("var(--primary)", "navy.800"); // Background color based on color mode
  const sidebarMargins = "0px"; // Sidebar margins

  return (
    <Box
      position="relative"
      w="300px"
      maxW="300px"
      display={{ base: "none", xl: "block" }} // Only display on extra-large screens
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
          <Content routes={routes} /> {/* Render the content with routes */}
        </Scrollbars>
      </Box>
    </Box>
  );
};

// Responsive Sidebar component for smaller screens
// eslint-disable-next-line react/prop-types
export const SidebarResponsive = ({ routes }) => {
  const sidebarBackgroundColor = useColorModeValue(
    "var(--primary)",
    "navy.800"
  ); // Background color based on color mode
  const menuColor = useColorModeValue("white", "white"); // Menu icon color
  const { isOpen, onOpen, onClose } = useDisclosure(); // Disclosure hook for drawer
  const btnRef = useRef(); // Reference for the menu button
  const { pathname } = useLocation(); // Get current path

  useEffect(() => {
    onClose(); // Close the drawer when the path changes
  }, [pathname, onClose]);

  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
      {" "}
      {/* Only display on small screens */}
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="40px"
          h="40px"
          me="10px"
          _hover={{ cursor: "pointer" }} // Hover effect for the menu icon
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"} // Drawer placement based on text direction
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex="3"
            onClose={onClose}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }} // Remove focus and hover box shadow
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content routes={routes} /> {/* Render the content with routes */}
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

// PropTypes validation for Sidebar component
Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidebar;
