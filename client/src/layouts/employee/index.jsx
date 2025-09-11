import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  waiterRoutes,
  deliveryRoutes,
  chefRoutes,
  managerRoutes,
  staffRoutes,
  bartenderRoutes,
  helperRoutes,
  commonRoutes,
} from "../../routes.jsx";
import { useUser } from "../../hooks/useUser.js";
import { employeesRoles } from "../../utils/constant.js";
import EmployeeSidebar from "../../components/sidebar/EmployeeSidebar.jsx";

export default function EmployeeDashboard() {
  const { userRole, permittedRoute } = useUser();
  const [routes, setRoutes] = useState([]);

  const roleRouteMap = {
    [employeesRoles.WAITER]: waiterRoutes,
    [employeesRoles.DELIVERY_BOY]: deliveryRoutes,
    [employeesRoles.MANAGER]: managerRoutes,
    [employeesRoles.CHEF]: chefRoutes,
    [employeesRoles.KITCHEN_STAFF]: staffRoutes,
    [employeesRoles.BAR_TENDER]: bartenderRoutes,
    [employeesRoles.HELPER]: helperRoutes,
    [employeesRoles.CUSTOM]: [],
  };

  const permissionToRoutePaths = {
    "Inventory-Management": ["/item-management"],
    "Employee-Management": ["/employees"],
    "Food-And-Drinks": ["/orders", "/order-history"],
    "Delivery-Tracking": ["/delivery-tracking"],
  };

  useEffect(() => {
    const allRoutes = roleRouteMap[userRole] || [];

    let allowedPaths = [];
    if (permittedRoute && permittedRoute.length > 0) {
      allowedPaths = permittedRoute
        .map((permission) => permissionToRoutePaths[permission.label] || [])
        .flat();
    }

    const updatedRoutes = allRoutes.map((route) => {
      if (!route.links) return route;
      return {
        ...route,
        links: route.links.filter((link) => {
          const isCommon = commonRoutes.some((r) => r.path === link.path);
          if (!isCommon) return true;
          return allowedPaths.includes(link.path);
        }),
      };
    });

    setRoutes(updatedRoutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);
  return (
    <div className="flex bg-primary-bg min-h-screen h-full max-w-screen">
      <EmployeeSidebar routes={routes} />

      <main className="flex-1 min-h-screen h-full flex transition-all duration-300 bg-white">
        <Outlet />
      </main>
    </div>
  );
}
