import { Box, useDisclosure, Flex } from "@chakra-ui/react";
import Footer from "../../components/footer/FooterAdmin.jsx";
import Navbar from "../../components/navbar/NavbarAdmin.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import SidebarRight from "../../components/sidebarRight/SidebarRight.jsx";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import routes from "../../routes.jsx";

export default function Dashboard(props) {
  const { ...rest } = props;
  const [fixed] = useState(false);
  // const [toggleSidebar, setToggleSidebar] = useState(false);

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
        // Check if the current route matches the URL
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
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
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };

  const getActiveNavbarText = (routes) => {
    let activeNavbar = false;
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
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbar;
  };

  document.documentElement.dir = "ltr";
  const { onOpen } = useDisclosure();

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
          onOpen={onOpen}
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
        <Footer />
      </Box>
      <SidebarRight />
    </Flex>
  );
}
