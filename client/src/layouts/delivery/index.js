// Chakra imports
import {
  Portal,
  Box,
  useDisclosure,
  Text,
  Button,
  Link,
  Flex,
} from "@chakra-ui/react";
import Footer from "components/footer/FooterAdmin.js";
// Layout components
import Navbar from "components/navbar/NavbarDelivery.js";
import Sidebar from "components/sidebar/Sidebar.js";
import SidebarRight from "components/sidebarRight/SidebarRight";
import { SidebarContext } from "contexts/SidebarContext";
import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { deliveryRoutes as routes } from "routes.js";

// Custom Chakra theme
export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
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
  const getRoutes = (routes) => {
    console.log("Routes", routes);
    return routes.map((prop, key) => {
      if (prop.layout === "/delivery") {
        return prop.type === "link" ? (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        ) : (
          prop.links.map((link, j) => (
            <Route
              path={link.layout + link.path}
              component={link.component}
              key={j}
            />
          ))
        );
      }
      if (prop.collapse) {
        return getRoutes(prop.items);
      }
      if (prop.category) {
        return getRoutes(prop.items);
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = "ltr";
  const { onOpen } = useDisclosure();
  document.documentElement.dir = "ltr";
  return (
    <SidebarContext.Provider
      value={{
        toggleSidebar,
        setToggleSidebar,
      }}
    >
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

          <Box mt="30px" p="20px">
            {/* {getRoute() ? ( */}
            <Box mx="auto" p="10px" minH="100vh" pt="50px">
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/" to="/delivery/dashboard" />
              </Switch>
            </Box>
            {/* ) : null} */}
          </Box>
          <Footer />
        </Box>
        <SidebarRight />
      </Flex>
    </SidebarContext.Provider>
  );
}
