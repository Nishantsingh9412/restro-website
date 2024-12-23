import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import routes from "../../routes.jsx";

// Chakra imports
import { Box, useColorModeValue } from "@chakra-ui/react";

// Layout components
import { SidebarContext } from "../../contexts/SidebarContext.jsx";

// Custom Chakra theme
export default function Auth() {
  // State to manage the sidebar toggle
  const [toggleSidebar, setToggleSidebar] = useState(false);

  // Function to determine if the current route is not the full-screen maps route
  const getRoute = () => {
    return window.location.pathname !== "/auth/full-screen-maps";
  };

  // Function to generate route components based on the routes configuration
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
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

  // Determine the background color based on the current color mode
  const authBg = useColorModeValue("white", "navy.900");

  // Set the document direction to left-to-right
  document.documentElement.dir = "ltr";

  return (
    <Box>
      {/* Provide the sidebar context to child components */}
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Box
          bg={authBg}
          float="right"
          minHeight="100vh"
          height="100%"
          position="relative"
          w="100%"
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          {/* Render routes if the current route is not the full-screen maps route */}
          {getRoute() ? (
            <Box mx="auto" minH="100vh">
              <Routes>
                {getRoutes(routes)}
                <Route from="/auth" to="/auth/sign-in/default" />
              </Routes>
            </Box>
          ) : null}
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
