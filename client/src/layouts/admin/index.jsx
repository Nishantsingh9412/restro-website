import { Outlet } from "react-router-dom";
import { adminRoutes } from "../../routes.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Navbar from "../../components/navbar/NavbarAdmin.jsx";
// import SidebarRight from "../../components/sidebarRight/SidebarRight.jsx";

export default function AdminLayout() {
  // const { ...rest } = props;
  // const location = useLocation();
  // const [fixed] = useState(false);

  // Helper functions for active route/navbar
  // const getActiveRoute = (routes) => {
  //   const defaultRoute = "Default Brand Text"; // Default message if no route is active

  //   for (let i = 0; i < routes.length; i++) {
  //     if (routes[i].collapse) {
  //       // Recursively check collapsed routes
  //       let collapseActiveRoute = getActiveRoute(routes[i].items);
  //       if (collapseActiveRoute !== defaultRoute) {
  //         return collapseActiveRoute; // Return the first active route found in collapsed items
  //       }
  //     } else if (routes[i].links) {
  //       // Recursively check links if they exist
  //       let linkActiveRoute = getActiveRoute(routes[i].links);
  //       if (linkActiveRoute !== defaultRoute) {
  //         return linkActiveRoute; // Return the first active route found in links
  //       }
  //     } else {
  //       // Check if the current route matches the location
  //       if (location.pathname === routes[i].layout + routes[i].path) {
  //         return routes[i].name; // Return the name of the active route
  //       }
  //     }
  //   }

  //   return defaultRoute; // Return default message if no active route is found
  // };

  // const getActiveNavbar = (routes) => {
  //   let activeNavbar = false;
  //   for (let i = 0; i < routes.length; i++) {
  //     if (routes[i].collapse) {
  //       let collapseActiveNavbar = getActiveNavbar(routes[i].items);
  //       if (collapseActiveNavbar !== activeNavbar) {
  //         return collapseActiveNavbar;
  //       }
  //     } else if (routes[i].category) {
  //       let categoryActiveNavbar = getActiveNavbar(routes[i].items);
  //       if (categoryActiveNavbar !== activeNavbar) {
  //         return categoryActiveNavbar;
  //       }
  //     } else {
  //       if (location.pathname === routes[i].layout + routes[i].path) {
  //         return routes[i].secondary;
  //       }
  //     }
  //   }
  //   return activeNavbar;
  // };

  // const getActiveNavbarText = (routes) => {
  //   let activeNavbar = "Default Brand Text";
  //   for (let i = 0; i < routes.length; i++) {
  //     if (routes[i].collapse) {
  //       let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
  //       if (collapseActiveNavbar !== activeNavbar) {
  //         return collapseActiveNavbar;
  //       }
  //     } else if (routes[i].category) {
  //       let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
  //       if (categoryActiveNavbar !== activeNavbar) {
  //         return categoryActiveNavbar;
  //       }
  //     } else {
  //       if (location.pathname === routes[i].layout + routes[i].path) {
  //         return routes[i].messageNavbar;
  //       }
  //     }
  //   }
  //   return activeNavbar;
  // };

  return (
    <div className="flex bg-primary-bg min-h-screen h-full max-w-screen">
      <Sidebar routes={adminRoutes} />
      <main className="flex-1 min-h-screen h-full flex flex-col transition-all duration-300">
        <div className="relative top-0 z-30 w-full">
          <Navbar />
        </div>
        <div className="flex-1 w-full px-1 md:px-2">
          <Outlet />
        </div>
      </main>
      {/* <SidebarRight className="hidden lg:block" /> */}
    </div>
  );
}
