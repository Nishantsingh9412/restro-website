//TODO: Remove this file
// import { Box, Flex, useDisclosure } from "@chakra-ui/react";
// import Footer from "../../components/footer/FooterAdmin.jsx";
// import Navbar from "../../components/navbar/NavbarDelivery.jsx";
// import Sidebar from "../../components/sidebar/Sidebar.jsx";
// import SidebarRight from "../../components/sidebarRight/SidebarRight.jsx";
// import { useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import { deliveryRoutes as routes } from "../../routes.jsx";

// export default function Dashboard(props) {
//   const { ...rest } = props;
//   const [fixed] = useState(false);
//   const location = useLocation(); // Hook to get the current location
//   const { onOpen } = useDisclosure(); // Chakra hook for additional controls if needed

//   // Helper function to get the active route name based on the current location
//   const getActiveRoute = (routes) => {
//     const defaultRoute = "Default Brand Text"; // Default text if no active route is found

//     for (let i = 0; i < routes.length; i++) {
//       if (routes[i].collapse) {
//         const activeRoute = getActiveRoute(routes[i].items);
//         if (activeRoute !== defaultRoute) return activeRoute;
//       } else if (routes[i].links) {
//         const activeRoute = getActiveRoute(routes[i].links);
//         if (activeRoute !== defaultRoute) return activeRoute;
//       } else if (location.pathname === routes[i].layout + routes[i].path) {
//         return routes[i].name;
//       }
//     }
//     return defaultRoute;
//   };

//   // Helper function to determine if the active route has a secondary navbar
//   const getActiveNavbar = (routes) => {
//     let activeNavbar = false;
//     for (let i = 0; i < routes.length; i++) {
//       if (routes[i].collapse) {
//         const collapseNavbar = getActiveNavbar(routes[i].items);
//         if (collapseNavbar) return collapseNavbar;
//       } else if (routes[i].category) {
//         const categoryNavbar = getActiveNavbar(routes[i].items);
//         if (categoryNavbar) return categoryNavbar;
//       } else if (location.pathname === routes[i].layout + routes[i].path) {
//         return routes[i].secondary;
//       }
//     }
//     return activeNavbar;
//   };

//   // Helper function to get the active navbar text based on the current location
//   const getActiveNavbarText = (routes) => {
//     const defaultText = "Default Navbar Text";
//     for (let i = 0; i < routes.length; i++) {
//       if (routes[i].collapse) {
//         const collapseNavbarText = getActiveNavbarText(routes[i].items);
//         if (collapseNavbarText !== defaultText) return collapseNavbarText;
//       } else if (routes[i].category) {
//         const categoryNavbarText = getActiveNavbarText(routes[i].items);
//         if (categoryNavbarText !== defaultText) return categoryNavbarText;
//       } else if (location.pathname === routes[i].layout + routes[i].path) {
//         return routes[i].messageNavbar;
//       }
//     }
//     return defaultText;
//   };

//   document.documentElement.dir = "ltr"; // Ensure proper layout direction (left-to-right)

//   return (
//     <Flex bg="var(--primary-bg)" h="100%">
//       {/* Sidebar on the left */}
//       <Sidebar routes={routes} display="none" {...rest} />

//       {/* Main content area */}
//       <Box
//         minHeight="100vh"
//         height="100%"
//         overflow="auto"
//         position="relative"
//         maxHeight="100%"
//         transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
//         transitionDuration=".2s, .2s, .35s"
//         transitionProperty="top, bottom, width"
//         transitionTimingFunction="linear, linear, ease"
//         flex="1"
//         pb="80px"
//       >
//         {/* Navbar component */}
//         <Navbar
//           onOpen={onOpen}
//           logoText={"Horizon UI Dashboard PRO"}
//           brandText={getActiveRoute(routes)}
//           secondary={getActiveNavbar(routes)}
//           message={getActiveNavbarText(routes)}
//           fixed={fixed}
//           {...rest}
//         />

//         {/* Outlet for rendering matched routes */}
//         <Box mt="130px" p="20px">
//           <Outlet />
//         </Box>

//         {/* Footer component */}
//         <Footer />
//       </Box>

//       {/* Sidebar on the right */}
//       <SidebarRight />
//     </Flex>
//   );
// }
