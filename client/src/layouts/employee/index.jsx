import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Footer from "../../components/footer/FooterAdmin.jsx";
import Navbar from "../../components/navbar/EmployeeNavbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import SidebarRight from "../../components/sidebarRight/SidebarRight.jsx";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  waiterRoutes,
  deliveryRoutes,
  chefRoutes,
  managerRoutes,
  staffRoutes,
  bartenderRoutes,
  helperRoutes,
} from "../../routes.jsx";

export default function EmployeeDashboard(props) {
  const { ...rest } = props;
  const [fixed] = useState(false);
  const [routes, setRoutes] = useState([]);
  const location = useLocation();
  const { onOpen } = useDisclosure();
  const [role, setRole] = useState(null);

  // Load role from localStorage
  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("ProfileData"));
    setRole(localData?.result?.role?.toLowerCase());
  }, []);

  useEffect(() => {
    setRoutes(getRoutes(role));
  }, [role]);

  const getRoutes = (role) => {
    switch (role) {
      case "waiter":
        return waiterRoutes;
      case "delivery boy":
        return deliveryRoutes;
      case "manager":
        return managerRoutes;
      case "chef":
        return chefRoutes;
      case "staff":
        return staffRoutes;
      case "bar tender":
        return bartenderRoutes;
      case "helper":
        return helperRoutes;
      case "custom":
        return [];
      default:
        return [];
    }
  };

  const getActiveRoute = (routes) => {
    const defaultRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        const activeRoute = getActiveRoute(routes[i].items);
        if (activeRoute !== defaultRoute) return activeRoute;
      } else if (routes[i].links) {
        const activeRoute = getActiveRoute(routes[i].links);
        if (activeRoute !== defaultRoute) return activeRoute;
      } else if (location.pathname === routes[i].layout + routes[i].path) {
        return routes[i].name;
      }
    }
    return defaultRoute;
  };

  const getActiveNavbar = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        const collapseNavbar = getActiveNavbar(routes[i].items);
        if (collapseNavbar) return collapseNavbar;
      } else if (routes[i].category) {
        const categoryNavbar = getActiveNavbar(routes[i].items);
        if (categoryNavbar) return categoryNavbar;
      } else if (location.pathname === routes[i].layout + routes[i].path) {
        return routes[i].secondary;
      }
    }
    return false;
  };

  const getActiveNavbarText = (routes) => {
    const defaultText = "Default Navbar Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        const collapseNavbarText = getActiveNavbarText(routes[i].items);
        if (collapseNavbarText !== defaultText) return collapseNavbarText;
      } else if (routes[i].category) {
        const categoryNavbarText = getActiveNavbarText(routes[i].items);
        if (categoryNavbarText !== defaultText) return categoryNavbarText;
      } else if (location.pathname === routes[i].layout + routes[i].path) {
        return routes[i].messageNavbar;
      }
    }
    return defaultText;
  };

  return (
    <Flex bg="var(--primary-bg)" h="100%">
      <Sidebar routes={routes} display="none" {...rest} />

      <Box
        minHeight="100vh"
        overflow="auto"
        position="relative"
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
          {/* Show Outlet when role is loaded */}
        </Box>

        <Footer />
      </Box>

      <SidebarRight />
    </Flex>
  );
}
