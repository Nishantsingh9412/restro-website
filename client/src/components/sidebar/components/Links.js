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
          <>
            <Text
              fontSize={"md"}
              color={useColorModeValue("gray.700", "white")}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt="18px"
              pb="12px"
              key={index}
            >
              {route.name}
            </Text>
            {createLinks(route.items)}
          </>
        );
      } else if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/delivery" ||
        route.layout === "/rtl"
      ) {
        return route.type === "list" ? (
          <Box mb="6">
            {route.name && (
              <NavLink key={index} to={route.layout + route.path}>
                <Heading
                  fontSize="28px"
                  textAlign="center"
                  fontWeight="500"
                  mb="10px"
                  py="10px"
                  className={
                    "sidebar-link " +
                    (includeActiveRoute(route.path.split("/")[1].toLowerCase())
                      ? "active-sidebar-link"
                      : "")
                  }
                >
                  {route.name}
                </Heading>
              </NavLink>
            )}
            {route?.links?.map((nestedRoute, j) => (
              <NavItem
                key={j}
                route={nestedRoute}
                activeRoute={activeRoute}
                prefix={route.icon}
              />
            ))}
          </Box>
        ) : route.type === "link" ? (
          <NavItem key={index} route={route} activeRoute={activeRoute} />
        ) : (
          ""
        );
      }
    });
  };
  //  BRAND
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
  const { pathname } = useLocation();

  if (!route.name) return <></>;
  return (
    <NavLink to={route.layout + route.path}>
      <Box
        className={
          "sidebar-link " +
          (pathname.includes(route.layout) && pathname.includes(route.path)
            ? "active-sidebar-link"
            : "")
        }
      >
        <HStack
          spacing={
            pathname.includes(route.layout) && pathname.includes(route.path)
              ? "22px"
              : "26px"
          }
          py="5px"
          ps="10px"
        >
          <Flex w="100%" alignItems="center" justifyContent="center">
            {prefix && (
              <Center
                color={
                  pathname.includes(route.layout) &&
                  pathname.includes(route.path)
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
                pathname.includes(route.layout) && pathname.includes(route.path)
                  ? "bold"
                  : "normal"
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
