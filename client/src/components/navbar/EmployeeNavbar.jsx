// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Img,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import EmployeeNavbarLinks from "./EmployeeNabvarLinks";
import { SidebarResponsive } from "../../components/sidebar/Sidebar";
import routes from "../../routes";

export default function EmployeeNavbar(props) {
  const [scrolled, setScrolled] = useState(false);

  // Function to handle navbar style change on scroll
  const changeNavbar = useCallback(() => {
    setScrolled(window.scrollY > 1);
  }, []);

  // Add scroll event listener on mount and clean up on unmount
  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);
    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  }, [changeNavbar]);

  const { secondary, message, brandText } = props;

  // Define styles based on color mode and state
  const mainText = useColorModeValue("white", "white");
  const secondaryText = useColorModeValue("gray.200", "white");
  const navbarBg = useColorModeValue("var(--primary)", "rgba(11,20,55,0.5)");

  return (
    <Box
      position="absolute"
      boxShadow="none"
      bg={navbarBg}
      borderColor="transparent"
      filter="none"
      backdropFilter="blur(20px)"
      borderRadius="40px"
      borderWidth="1.5px"
      borderStyle="solid"
      transition="box-shadow 0.25s linear, background-color 0.25s linear, filter 0.25s linear, border 0.25s linear"
      alignItems={{ xl: "center" }}
      display={secondary ? "block" : "flex"}
      minH="75px"
      justifyContent={{ xl: "center" }}
      flexDirection={{ lg: "row", base: "column" }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondary ? "0px" : "20px"}
      p="20px"
      gap="10px"
      right="5%"
      top={{ base: "12px", md: "16px", lg: "20px", xl: "20px" }}
      w="90%"
      zIndex={2}
    >
      {/* Mobile view: Logo and Sidebar */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="10px"
        me="10px"
        color="#fff"
        display={{ xl: "none", base: "flex" }}
        w="100%"
      >
        <Flex alignItems="center" gap="10px">
          <Img src="" w="50px" h="50px" alt="Employee Logo" />
          <Box>
            <Text>Hello</Text>
            <Text>Employee Name</Text>
          </Box>
        </Flex>
        <SidebarResponsive routes={routes} />
      </Flex>

      {/* Desktop view: Breadcrumb and Navbar Links */}
      <Flex
        w="100%"
        flexDirection={{ sm: "column", md: "row" }}
        alignItems={{ xl: "center" }}
        mb="0px"
      >
        <Box
          mb={{ sm: "8px", md: "0px" }}
          display={{ xl: "block", base: "none" }}
        >
          <Breadcrumb>
            <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
              <BreadcrumbLink href="#" color={secondaryText}>
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
              <BreadcrumbLink href="#" color={secondaryText}>
                {brandText}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize="34px"
            _hover={{ color: mainText }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            {brandText}
          </Link>
        </Box>
        <Box ms="auto" w={{ sm: "100%", md: "unset" }}>
          <EmployeeNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>

      {/* Display message if secondary prop is true */}
      {secondary && <Text color="white">{message}</Text>}
    </Box>
  );
}

EmployeeNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
  message: PropTypes.string,
  logoText: PropTypes.string,
};
