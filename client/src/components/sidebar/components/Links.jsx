/* eslint-disable */
import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Center,
  Circle,
  Flex,
  HStack,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// NavItem component to render individual navigation items
const NavItem = React.memo(({ route, activeRoute, prefix = "" }) => {
  // Define color values based on the current color mode
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  const activeIcon = useColorModeValue("brand.500", "white");
  const textColor = useColorModeValue("secondaryGray.500", "white");
  const brandColor = useColorModeValue("brand.500", "brand.400");

  return (
    <NavLink to={route.layout + route.path}>
      <Box
        className={`sidebar-link ${
          activeRoute(route.path.toLowerCase()) ? "active-sidebar-link" : ""
        }`}
      >
        <HStack
          spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
          py="5px"
          ps="10px"
        >
          <Flex w="100%" alignItems="center" justifyContent="center">
            {prefix && (
              <Center
                color={
                  activeRoute(route.path.toLowerCase())
                    ? "var(--primary)"
                    : "#fff"
                }
                me="10px"
              >
                {prefix}
              </Center>
            )}
            {route.icon && (
              <Circle
                color="#fff"
                me="10px"
                w="25px"
                h="25px"
                p="5px"
                bg="var(--primary-accent)"
              >
                {route.icon}
              </Circle>
            )}
            <Text
              me="auto"
              fontWeight={
                activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
              }
            >
              {route.name}
            </Text>
          </Flex>
        </HStack>
      </Box>
    </NavLink>
  );
});

// SidebarLinks component to render the sidebar with navigation links
export function SidebarLinks({ routes }) {
  const location = useLocation();

  // Memoized function to check if a route is active
  const activeRoute = useMemo(
    () => (routeName) => {
      const path = location.pathname;
      return path === "/delivery" + routeName || path === "/admin" + routeName;
    },
    [location.pathname]
  );

  // Memoized function to check if the current path includes a route
  const includeActiveRoute = useMemo(
    () => (routeName) => location.pathname.includes(routeName),
    [location.pathname]
  );

  // Function to create navigation links from routes
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.category) {
        // Render category header and its items
        return (
          <React.Fragment key={index}>
            <Text
              fontSize={"md"}
              color={useColorModeValue("gray.700", "white")}
              fontWeight="bold"
              mx="auto"
              ps={{ sm: "10px", xl: "16px" }}
              pt="18px"
              pb="12px"
            >
              {route.name}
            </Text>
            {createLinks(route.items)}
          </React.Fragment>
        );
        // TODO: Add support for nested categories
      } else if (
        ["/admin", "/auth", "/rtl", "/delivery"].includes(route.layout)
      ) {
        // Render main navigation links
        return (
          <Box mb="6" key={index}>
            <NavLink to={route.layout + route.path}>
              <Heading
                fontSize="28px"
                textAlign="center"
                fontWeight="500"
                mb="10px"
                py="10px"
                className={`sidebar-link ${
                  includeActiveRoute(route.path) ? "active-sidebar-link" : ""
                }`}
              >
                {route.name}
              </Heading>
            </NavLink>
            {route.links &&
              route.links.map((nestedRoute, j) => (
                <NavItem
                  key={j}
                  route={nestedRoute}
                  activeRoute={activeRoute}
                  prefix={route.icon}
                />
              ))}
          </Box>
        );
      }
      return null;
    });
  };

  return createLinks(routes);
}

export default React.memo(SidebarLinks);
