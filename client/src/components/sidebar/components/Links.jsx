/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
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

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === "/admin" + routeName;
  };
  const includeActiveRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.category) {
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
      } else if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        return (
          <Box mb="6" key={index}>
            <NavLink to={route.layout + route.path}>
              <Heading
                fontSize="28px"
                textAlign="center"
                fontWeight="500"
                mb="10px"
                py="10px"
                className={
                  "sidebar-link " +
                  (includeActiveRoute(route.path) ? "active-sidebar-link" : "")
                }
              >
                {route.name}
              </Heading>
            </NavLink>
            {/* Render nested links */}
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

export default SidebarLinks;

const NavItem = ({ route, activeRoute, prefix = "" }) => {
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  return (
    <NavLink to={route.layout + route.path}>
      <Box
        className={
          "sidebar-link " +
          (activeRoute(route.path.toLowerCase()) ? "active-sidebar-link" : "")
        }
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
};
