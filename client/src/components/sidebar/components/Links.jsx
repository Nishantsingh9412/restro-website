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
import PropTypes from "prop-types";

// SidebarLinks component to render the sidebar with navigation links
export function SidebarLinks({ routes }) {
  const location = useLocation();

  // Check if a route is active based on the current location
  const activeRoute = useMemo(
    () => (routeName) => {
      
      const path = location.pathname;
      return path === "/employee" + routeName || path === "/admin" + routeName;
    },
    [location.pathname]
  );

  // Check if the current path includes a specific route
  const includeActiveRoute = useMemo(
    () => (routeName) => location.pathname.includes(routeName),
    [location.pathname]
  );

  // Render category header
  const CategoryHeader = ({ name }) => {
    const categoryTextColor = useColorModeValue("gray.700", "white");
    return (
      <Text
        fontSize="md"
        color={categoryTextColor}
        fontWeight="bold"
        mx="auto"
        ps={{ sm: "10px", xl: "16px" }}
        pt="18px"
        pb="12px"
      >
        {name}
      </Text>
    );
  };

  CategoryHeader.propTypes = {
    name: PropTypes.string.isRequired,
  };

  // Render main navigation links
  const MainNavLink = ({ route }) => (
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
  );

  MainNavLink.propTypes = {
    route: PropTypes.shape({
      layout: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  // Generate navigation links from the routes array
  const createLinks = (routes) =>
    routes.map((route, index) => {
      if (route.category) {
        // Render category header and its items recursively
        return (
          <React.Fragment key={index}>
            <CategoryHeader name={route.name} />
            {createLinks(route.items)}
          </React.Fragment>
        );
      } else if (["/admin", "/auth", "/employee"].includes(route.layout)) {
        // Render main navigation links and nested links
        return (
          <Box mb="6" key={index}>
            <MainNavLink route={route} />
            {route.links?.map((nestedRoute, j) => (
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

  // Render the generated links
  return createLinks(routes);
}

// NavItem component to render individual navigation items
const NavItem = React.memo(({ route, activeRoute, prefix = "" }) => {
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

NavItem.propTypes = {
  route: PropTypes.shape({
    layout: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    icon: PropTypes.node,
    name: PropTypes.string.isRequired,
  }).isRequired,
  activeRoute: PropTypes.func.isRequired,
  prefix: PropTypes.object,
};

NavItem.displayName = "NavItem";

export default React.memo(SidebarLinks);
