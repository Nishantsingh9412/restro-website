// import React from 'react';
import { Icon } from "@chakra-ui/react";
import {
  MdShoppingBag,
  MdLock,
  MdRestaurant,
  MdHistory,
  MdEvent,
} from "react-icons/md";
import { HiDocumentChartBar } from "react-icons/hi2";
import { IoAlertCircleSharp } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";

// Admin Imports
import MainDashboard from "./views/admin/default";
import ItemManagement from "./views/admin/itemManagement";
import LowStocks from "./views/admin/lowStocks";
import SupplierManagement from "./views/admin/supplierMgmt";
import AllOrders from "./views/admin/allOrders";
import OrderHistory from "./views/admin/orderHistory";
import EmployeeManagement from "./views/admin/employeeManagement";

// Auth Imports
import SignInCentered from "./views/auth/signIn";
import SignUpCentered from "./views/auth/signup";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/dashboards/default",
    icon: (
      <Icon
        as={HiDocumentChartBar}
        color="inherit"
        width="20px"
        height="20px"
      />
    ),
    component: MainDashboard,
  },
  {
    name: "Item Management",
    layout: "/admin",
    path: "/dashboards/item-management",
    icon: (
      <Icon as={MdShoppingBag} color="inherit" width="20px" height="20px" />
    ),
    component: ItemManagement,
  },
  {
    name: "Low Stock Alert",
    layout: "/admin",
    path: "/dashboards/low-stock-alert",
    icon: (
      <Icon
        as={IoAlertCircleSharp}
        color="inherit"
        width="20px"
        height="20px"
      />
    ),
    component: LowStocks,
  },
  {
    name: "Supplier Management",
    layout: "/admin",
    path: "/dashboards/supplier-management",
    icon: (
      <Icon as={TbTruckDelivery} color="inherit" width="20px" height="20px" />
    ),
    component: SupplierManagement,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "/orders",
    icon: <Icon as={MdRestaurant} color="inherit" width="20px" height="20px" />,
    component: AllOrders,
  },
  {
    name: "Order History",
    layout: "/admin",
    path: "/order-history",
    icon: <Icon as={MdHistory} color="inherit" width="20px" height="20px" />,
    component: OrderHistory,
  },
  {
    name: "Employee Management",
    layout: "/admin",
    path: "/employee-management",
    icon: <Icon as={MdEvent} color="inherit" width="20px" height="20px" />,
    component: EmployeeManagement,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "/sign-up",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignUpCentered,
  },
];

export default routes;
