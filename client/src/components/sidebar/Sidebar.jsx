import { useEffect, useRef, useMemo, useState, useCallback } from "react";
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
import { IoArrowForward, IoMenuOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { getLoggedInUserData } from "../../redux/action/user";
import { localStorageData } from "../../utils/constant";

// Sidebar component for larger screens
const Sidebar = ({ routes }) => {
  const sidebarBg = useColorModeValue("var(--primary)", "navy.800");
  const sidebarMargins = "0px";
  const dispatch = useDispatch();
  const localData = JSON.parse(
    localStorage.getItem(localStorageData.PROFILE_DATA)
  );
  const role = localData?.result?.role;
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  // Memoize routes to avoid unnecessary re-renders
  const memoizedRoutes = useMemo(() => routes, [routes]);

  // Function to handle resizing
  const resizeSidebar = useCallback(
    (e) => {
      if (isResizing) {
        e.preventDefault(); // Prevent text selection
        document.body.style.userSelect = "none"; // Disable text selection
        const newWidth = Math.max(200, Math.min(400, e.clientX)); // between 200px and 400px
        if (newWidth > 200 && newWidth < 500) {
          setSidebarWidth(newWidth);
        } else {
          setSidebarWidth(0);
        }
      }
    },
    [isResizing] // Add isResizing as a dependency
  );

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = ""; // Re-enable text selection
  }, []);
  // Function to reset sidebar width
  const resetSidebarWidth = () => {
    setSidebarWidth(300);
  };

  useEffect(() => {
    // Add event listeners to handle resizing
    window.addEventListener("mousemove", resizeSidebar);
    window.addEventListener("mouseup", stopResizing);

    // Fetch logged-in user data
    dispatch(getLoggedInUserData(role));

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", resizeSidebar);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [dispatch, role, resizeSidebar, stopResizing]);

  return (
    <>
      {sidebarWidth === 0 && (
        <Box
          position="absolute"
          top="10"
          left="0"
          width="30px"
          height="30px"
          zIndex="99"
          bg={sidebarBg}
          cursor={"pointer"}
          borderRadius="10%"
          onClick={resetSidebarWidth}
        >
          {/* Icon Arrow */}
          <Icon
            as={IoArrowForward}
            color="white"
            position="absolute"
            top="50%"
            left="50%"
            transformOrigin="center"
            transform="translate(-50%, -50%)"
            _hover={{ cursor: "pointer" }}
          />
        </Box>
      )}

      <Box
        position="relative"
        w={`${sidebarWidth}px`}
        maxW="300px"
        display={{ base: "none", xl: "block" }}
      >
        <Box
          bg={sidebarBg}
          w={`${sidebarWidth}px`}
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
        <Box
          position="absolute"
          top="0"
          right="0"
          width="10px"
          height="100%"
          cursor="ew-resize"
          zIndex="10"
          onMouseDown={() => setIsResizing(true)}
        />
      </Box>
    </>
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
