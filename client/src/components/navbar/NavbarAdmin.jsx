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
import AdminNavbarLinks from "./NavbarLinksAdmin";
import { SidebarResponsive } from "../sidebar/Sidebar";
import routes from "../../routes.jsx";
import profileImg from "../../assets/img/profile/profile.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar({
  secondary,
  message,
  brandText,
  logoText,
  fixed,
}) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const adminData = useSelector((state) => state.userReducer.data);

  const changeNavbar = useCallback(() => {
    setScrolled(window.scrollY > 1);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);
    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  }, [changeNavbar]);

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
      transition="box-shadow 0.25s linear, background-color 0.25s linear, filter 0.25s linear, border 0s linear"
      alignItems={{ xl: "center" }}
      display={secondary ? "block" : "flex"}
      minH="75px"
      justifyContent={{ xl: "center" }}
      flexDirection={{ lg: "row", base: "column" }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondary ? "0px" : "0px"}
      p="20px"
      gap="10px"
      right="5%"
      top={{ base: "12px", md: "16px", lg: "20px", xl: "20px" }}
      w="90%"
    >
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
          <Img
            src={adminData?.profile_picture ?? profileImg}
            w="50px"
            h="50px"
          />
          <Box>
            <Text>Hey</Text>
            <Text>{adminData?.username ?? "User"}</Text>
          </Box>
        </Flex>
        <SidebarResponsive routes={routes} />
      </Flex>
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
        <Box
          ms="auto"
          w={{ sm: "100%", md: "unset" }}
          display="flex"
          alignItems="center"
        >
          <AdminNavbarLinks
            logoText={logoText}
            secondary={secondary}
            fixed={fixed}
            scrolled={scrolled}
          />
          <Box
            as="button"
            bg="transparent"
            border="none"
            cursor="pointer"
            position="relative"
            onClick={() => navigate("notifications")}
          >
            <Img
              src="https://img.icons8.com/ios-filled/50/ffffff/appointment-reminders.png"
              alt="Notifications"
              w="28px"
              h="28px"
            />
            <Box
              position="absolute"
              top="-2px"
              right="-2px"
              bg="red.500"
              color="white"
              fontSize="10px"
              fontWeight="bold"
              borderRadius="full"
              w="16px"
              h="16px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              3
            </Box>
          </Box>
        </Box>
      </Flex>
      {secondary && <Text color="white">{message}</Text>}
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
  logoText: PropTypes.string,
  message: PropTypes.string,
};
