// import Navbar from "../../components/navbar/EmployeeNavbar.jsx";
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
} from "../../routes.jsx";
import { useUser } from "../../hooks/useUser.js";
import { employeesRoles } from "../../utils/constant.js";
import EmployeeSidebar from "../../components/sidebar/EmployeeSidebar.jsx";

export default function EmployeeDashboard() {
  const { userRole } = useUser();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    setRoutes(roleRouteMap[userRole] || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

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

  return (
    <div className="flex bg-primary-bg min-h-screen h-full max-w-screen">
      <EmployeeSidebar routes={routes} />
      <main className="flex-1 min-h-screen h-full flex transition-all duration-300 bg-white">
        <Outlet />
      </main>
    </div>
  );
}
