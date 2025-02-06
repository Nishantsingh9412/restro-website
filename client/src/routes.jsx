// import React from 'react';
import { Icon } from "@chakra-ui/react";
import {
  MdShoppingBag,
  MdRestaurant,
  MdHistory,
  MdChevronRight,
  MdLocalShipping,
  MdVideoLibrary,
  MdDashboard,
  MdOutlineDeliveryDining,
} from "react-icons/md";
import { HiDocumentChartBar } from "react-icons/hi2";
import { IoAlertCircleSharp, IoLockOpen } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbTruckDelivery, TbReorder } from "react-icons/tb";
import { AiFillPrinter } from "react-icons/ai";

// Admin Imports
import MainDashboard from "./views/admin/default";
import ItemManagement from "./views/admin/itemManagement";
import LowStocks from "./views/admin/lowStocks";
import SupplierManagement from "./views/admin/supplierMgmt";
import AllOrders from "./views/admin/allOrders";
import OrderHistory from "./views/admin/orderHistory";
import OrderShipping from "./views/admin/orderShipping";
import Dashboard from "./views/admin/dashboard";
import ShiftSchedule from "./views/admin/shiftSchedule";
import Absence from "./views/admin/absense";
import Employee from "./views/admin/employees";
import AvailableDeliveries from "./views/delivery/availableDeliveries"; // Adjust the path as necessary
import Notifications from "./views/delivery/notifications"; // Adjust the path as necessary
import DeliveryHistory from "./views/delivery/history"; // Adjust the path as necessary
import DeliveryDashboard from "./views/delivery/dashboard/index";
import AdminNotifications from "./views/admin/Notification";
import EmployeeShifts from "./views/employees/Shift/EmployeeShifts";

// // Auth Imports
// import SignInCentered from "./views/auth/signIn";
// import SignUpCentered from "./views/auth/signup";

const commonRoutes = [
  {
    name: "Item Management",
    layout: "/employee",
    path: "/item-management",
    icon: (
      <Icon as={MdShoppingBag} color="inherit" width="20px" height="20px" />
    ),
    // type: 'link',
    // component: () => <></>,
    component: <ItemManagement />,
  },
  {
    name: "Employees",
    layout: "/employee",
    path: "/employees",
    icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
    component: <Employee />,
  },
  {
    name: "Delivery Tracking",
    layout: "/employee",
    path: "/delivery-tracking",
    icon: (
      <Icon as={MdLocalShipping} width="20px" height="20px" color="inherit" />
    ),
    component: <OrderShipping />,
  },
  {
    name: "Foods and Drinks",
    layout: "/employee",
    path: "/orders",
    icon: <Icon as={MdRestaurant} width="20px" height="20px" color="inherit" />,
    component: <AllOrders />,
  },
  {
    name: "Order History",
    layout: "/employee",
    path: "/order-history",
    icon: <Icon as={MdHistory} width="20px" height="20px" color="inherit" />,
    component: <OrderHistory />,
  },
];

const adminRoutes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/dashboards/default",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <MainDashboard />,
    links: [
      {
        name: "Overview",
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
        type: "link",
        component: <MainDashboard />,
      },
      {
        name: "Item Management",
        layout: "/admin",
        path: "/item-management",
        icon: (
          <Icon as={MdShoppingBag} color="inherit" width="20px" height="20px" />
        ),
        // type: 'link',
        // component: () => <></>,
        component: <ItemManagement />,
      },
      {
        name: "Low stock Alert",
        layout: "/admin",
        path: "/low-stock-alert",
        icon: (
          <Icon
            as={IoAlertCircleSharp}
            color="inherit"
            width="20px"
            height="20px"
          />
        ),
        // type: 'link',
        component: <LowStocks />,
      },
      {
        name: "Supplier Management",
        layout: "/admin",
        path: "/supplier-management",
        icon: (
          <Icon
            as={TbTruckDelivery}
            color="inherit"
            width="20px"
            height="20px"
          />
        ),
        type: "link",
        component: <SupplierManagement />,
      },
      {
        name: "Notifications",
        layout: "/admin",
        path: "/dashboards/notifications",
        icon: (
          <Icon
            as={IoMdNotificationsOutline}
            color="inherit"
            width="20px"
            height="20px"
          />
        ),
        type: "link",
        component: <AdminNotifications />,
      },

      // {
      //   name: 'Barcode Generator',
      //   layout: '/admin',
      //   path: '/dashboards/barcode',
      //   icon: (
      //     <Icon as={BiBarcodeReader} width="20px" height="20px" color="inherit" />
      //   ),
      //   component: <BarcodeGenerator />,
      // },
    ],
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "/orders",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    links: [
      {
        name: "Foods and Drinks",
        layout: "/admin",
        path: "/orders",
        icon: (
          <Icon as={MdRestaurant} width="20px" height="20px" color="inherit" />
        ),
        component: <AllOrders />,
      },
      // {
      //   name: 'Recent Orders',
      //   layout: '/admin',
      //   path: '/process-order',
      //   icon: (
      //     <Icon as={MdLocalShipping} width="20px" height="20px" color="inherit" />
      //   ),
      //   component: OrderShipping,
      // },
      {
        name: "Order History",
        layout: "/admin",
        path: "/order-history",
        icon: (
          <Icon as={MdHistory} width="20px" height="20px" color="inherit" />
        ),
        component: <OrderHistory />,
      },
      {
        name: "Create Deliveries",
        layout: "/admin",
        path: "/create-deliveries",
        icon: (
          <Icon as={MdShoppingBag} width="20px" height="20px" color="inherit" />
        ),
        component: <>Coming Soon</>,
      },
    ],
  },
  {
    name: "Employee Planning",
    layout: "/admin",
    path: "/personalplan-dashboard",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    links: [
      {
        name: "Dashboard",
        layout: "/admin",
        path: "/personalplan-dashboard",
        icon: (
          <Icon
            as={HiDocumentChartBar}
            color="inherit"
            width="20px"
            height="20px"
          />
        ),
        component: <Dashboard />,
      },
      // {
      //   name: 'Recent Orders',
      //   layout: '/admin',
      //   path: '/process-order',
      //   icon: (
      //     <Icon as={MdLocalShipping} width="20px" height="20px" color="inherit" />
      //   ),
      //   component: OrderShipping,
      // },
      {
        name: "Shift Schedule",
        layout: "/admin",
        path: "/shift-schedule",
        icon: (
          <Icon as={MdHistory} width="20px" height="20px" color="inherit" />
        ),
        component: <ShiftSchedule />,
      },
      // {
      //   name: "Assign Schedule",
      //   layout: "/admin",
      //   path: "/employee-management",
      //   icon: <Icon as={MdEvent} width="20px" height="20px" color="inherit" />,
      //   component: <EmployeeManagement />,
      // },
      {
        name: "Absences",
        layout: "/admin",
        path: "/absences",
        icon: (
          <Icon as={MdShoppingBag} width="20px" height="20px" color="inherit" />
        ),
        component: <Absence />,
      },
      {
        name: "Employees",
        layout: "/admin",
        path: "/employees",
        icon: (
          <Icon as={MdHistory} width="20px" height="20px" color="inherit" />
        ),
        component: <Employee />,
      },
    ],
  },
  {
    name: "Delivery Partners",
    layout: "/admin",
    path: "/delivery-tracking",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    links: [
      {
        name: "Delivery Tracking",
        layout: "/admin",
        path: "/delivery-tracking",
        icon: (
          <Icon
            as={MdLocalShipping}
            width="20px"
            height="20px"
            color="inherit"
          />
        ),
        component: <OrderShipping />,
      },
      // {
      //   name: "Delivery partners",
      //   layout: "/admin",
      //   path: "/delivery-partners",
      //   icon: (
      //     <Icon
      //       as={MdLocalShipping}
      //       width="20px"
      //       height="20px"
      //       color="inherit"
      //     />
      //   ),
      //   component: <OrderShipping />,
      // },
    ],
  },
  // {
  //   name: "Employee",
  //   layout: "/admin",
  //   path: "/employee-management",
  //   type: "list",
  //   icon: (
  //     <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
  //   ),
  //   links: [
  // {
  //   name: "Assign Schedule",
  //   layout: "/admin",
  //   path: "/employee-management",
  //   icon: <Icon as={MdEvent} width="20px" height="20px" color="inherit" />,
  //   component: <EmployeeManagement />,
  // },
  // {
  //   name: "Shift Schedule",
  //   layout: "/admin",
  //   path: "/shift-schedule",
  //   icon: (
  //     <Icon as={MdHistory} width="20px" height="20px" color="inherit" />
  //   ),
  //   component: <ShiftSchedule />,
  // },
  //   ],
  // },
  {
    name: "Warehouse",
    layout: "/admin",
    path: "/warehouse",
    type: "list",
    icon: (
      <>
        <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
      </>
    ),
    links: [
      {
        name: "Contact Sales",
        layout: "/admin",
        path: "/warehouse/contact-sales",
        icon: (
          <Icon as={IoLockOpen} color="inherit" width="20px" height="20px" />
        ),
        type: "link",
        component: <></>,
      },
      // {
      //   name: 'Cost Tracking',
      //   layout: '/admin',
      //   path: '/tracking/cost-tracking',
      //   icon: (
      //     <Icon
      //       as={FaMoneyBillTrendUp}
      //       color="inherit"
      //       width="20px"
      //       height="20px"
      //     />
      //   ),
      //   type: 'link',
      //   component: () => <></>,
      // },
      // {
      //   name: 'Waste Tracking',
      //   layout: '/admin',
      //   path: '/tracking/waste-tracking',
      //   icon: (
      //     <Icon
      //       as={GiNuclearWaste}
      //       color="inherit"
      //       width="20px"
      //       height="20px"
      //     />
      //   ),
      //   type: 'link',
      //   component: () => <></>,
      // },
    ],
  },
  {
    name: "Invoices",
    layout: "/admin",
    path: "/invoices/re-ordering",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    links: [
      {
        name: "Re-Ordering",
        layout: "/admin",
        path: "/invoices/re-ordering",
        icon: (
          <Icon as={TbReorder} color="inherit" width="20px" height="20px" />
        ),
        type: "link",
        component: () => <></>,
      },
      {
        name: "Tutorial Videos",
        layout: "/admin",
        path: "/invoices/tutorial-videos",
        icon: (
          <Icon
            as={MdVideoLibrary}
            color="inherit"
            width="20px"
            height="20px"
          />
        ),
        type: "link",
        component: () => <></>,
      },
      {
        name: "Printer Setting",
        layout: "/admin",
        path: "/invoices/printer-setting",
        icon: (
          <Icon as={AiFillPrinter} color="inherit" width="20px" height="20px" />
        ),
        type: "link",
        component: () => <></>,
      },
    ],
  },

  // {
  //   name: "Sign In",
  //   layout: "/auth",
  //   path: "/sign-in",
  //   icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
  //   component: SignInCentered,
  // },
  // {
  //   name: "Sign Up",
  //   layout: "/auth",
  //   path: "/sign-up",
  //   icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
  //   component: SignUpCentered,
  // },
];

export const deliveryRoutes = [
  {
    name: "Delivery",
    layout: "/employee",
    path: "/delivery/dashboard/default",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/delivery/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Deliveries",
        layout: "/employee",
        path: "/delivery/available-deliveries",
        type: "link",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <AvailableDeliveries />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/delivery/available-shifts",
        type: "link",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeShifts />,
      },
      {
        name: "Notifications",
        layout: "/employee",
        path: "/delivery/notifications",
        type: "link",
        icon: (
          <Icon
            as={IoMdNotificationsOutline}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <Notifications />,
      },
      {
        name: "History",
        layout: "/employee",
        path: "/delivery/history",
        type: "link",
        icon: (
          <Icon as={MdHistory} color="inherit" width="15px" height="15px" />
        ),
        component: <DeliveryHistory />,
      },
      ...commonRoutes,
    ],
  },
];

// Waiter Employee Routes
export const waiterRoutes = [
  {
    name: "Waiter",
    layout: "/employee",
    path: "/waiter/dashboard/default",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/waiter/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Orders",
        layout: "/employee",
        path: "/waiter/available-orders",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="20px"
            height="20px"
          />
        ),
        component: <AvailableDeliveries />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/waiter/available-shifts",
        type: "link",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];

// Chef Employee Routes
export const chefRoutes = [
  {
    name: "Chef",
    layout: "/employee",
    path: "/chef/dashboard/default",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/chef/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Orders",
        layout: "/employee",
        path: "/chef/available-orders",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="20px"
            height="20px"
          />
        ),
        component: <AvailableDeliveries />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/chef/available-shifts",
        type: "link",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];

//Manager Employee Routes
export const managerRoutes = [
  {
    name: "Manager",
    layout: "/employee",
    path: "/manager/dashboard/default",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/manager/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <DeliveryDashboard />,
      },

      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/manager/available-shifts",
        type: "link",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];

// Bartender Employee Routes
export const bartenderRoutes = [
  {
    name: "Bartender",
    layout: "/employee",
    path: "/bar/dashboard/default",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/bar/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/bar/available-shifts",
        type: "link",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];

// Staff Employee Routes
// Staff Employee Routes
export const staffRoutes = [
  {
    name: "Staff",
    layout: "/employee",
    path: "/staff/dashboard/default",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/staff/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/staff/available-shifts",
        type: "link",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];

// Helper Employee Routes
export const helperRoutes = [
  {
    name: "Helper",
    layout: "/employee",
    path: "/helper/dashboard/default",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/helper/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/helper/available-shifts",
        type: "link",
        icon: (
          <Icon
            as={MdOutlineDeliveryDining}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];

export default adminRoutes;
