import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../../components/navbar/NavbarAdmin.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import SidebarRight from "../../components/sidebarRight/SidebarRight.jsx";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import routes from "../../routes.jsx";
import { connectSocketIfDisconnected, socket } from "../../api/socket.js";
import { localStorageData } from "../../utils/constant.js";

export default function Dashboard(props) {
  const { ...rest } = props;
  const [fixed] = useState(false);
  const location = useLocation(); // Hook to get the current location
  const localData = JSON.parse(
    localStorage.getItem(localStorageData.PROFILE_DATA)
  );

  useEffect(() => {
    //Socket Initializer
    connectSocketIfDisconnected(); // Connect to socket

    // Emit event when user joins
    const handleConnect = () => {
      console.log("Socket Connected");
      socket.emit("userJoined", localData?.result?._id);
      const heartbeatInterval = setInterval(() => {
        socket.emit("heartbeat", localData?.result?._id);
      }, 10000);
      return () => {
        clearInterval(heartbeatInterval);
      };
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [localData?.result?._id]);

  // functions for changing the states from components
  const getActiveRoute = (routes) => {
    const defaultRoute = "Default Brand Text"; // Default message if no route is active

    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        // Recursively check collapsed routes
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== defaultRoute) {
          return collapseActiveRoute; // Return the first active route found in collapsed items
        }
      } else if (routes[i].links) {
        // Recursively check links if they exist
        let linkActiveRoute = getActiveRoute(routes[i].links);
        if (linkActiveRoute !== defaultRoute) {
          return linkActiveRoute; // Return the first active route found in links
        }
      } else {
        // Check if the current route matches the location
        if (location.pathname === routes[i].layout + routes[i].path) {
          return routes[i].name; // Return the name of the active route
        }
      }
    }

    return defaultRoute; // Return default message if no active route is found
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (location.pathname === routes[i].layout + routes[i].path) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };

  const getActiveNavbarText = (routes) => {
    let activeNavbar = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (location.pathname === routes[i].layout + routes[i].path) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbar;
  };

  return (
    <Flex bg="var(--primary-bg)" h="100%">
      <Sidebar routes={routes} display="none" {...rest} />
      <Box
        minHeight="100vh"
        height="100%"
        overflow="auto"
        position="relative"
        maxHeight="100%"
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
        flex="1"
        pb="80px"
      >
        <Navbar
          // onOpen={onOpen}
          logoText={"Horizon UI Dashboard PRO"}
          brandText={getActiveRoute(routes)}
          secondary={getActiveNavbar(routes)}
          message={getActiveNavbarText(routes)}
          fixed={fixed}
          {...rest}
        />

        <Box mt="130px" p="20px">
          <Outlet />
        </Box>
        {/* <Footer /> */}
      </Box>
      <SidebarRight />
    </Flex>
  );
}
