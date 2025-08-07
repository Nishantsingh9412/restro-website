import { Icon } from "@chakra-ui/react";
import { lazy } from "react";
import {
  MdShoppingBag,
  MdRestaurant,
  MdHistory,
  MdChevronRight,
  MdLocalShipping,
  MdDashboard,
  MdOutlineDeliveryDining,
  MdOutlineSchedule,
  MdOutlineHistory,
  MdOutlineAssignment,
} from "react-icons/md";
import {
  FiBox,
  FiPackage,
  FiCalendar,
  FiUser,
  FiClipboard,
  FiList,
  FiGrid,
  FiShoppingCart,
  FiTruck,
  FiShoppingBag,
} from "react-icons/fi";
import { IoBagHandleOutline } from "react-icons/io5"; //IoLockOpen
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiFoodMenu } from "react-icons/bi";
import { RiBikeLine } from "react-icons/ri";
// Lazy-loaded components for better chunking
const MainDashboard = lazy(() => import("./views/admin/default"));
const ItemManagement = lazy(() =>
  import("./views/admin/inventory/inventoryManagement")
);
const InventoryDashboard = lazy(() =>
  import("./views/admin/inventory/overview")
);
const StockSummary = lazy(() => import("./views/admin/inventory/stockSummary"));
const SupplierManagement = lazy(() =>
  import("./views/admin/inventory/supplierManagement")
);
const AllOrders = lazy(() => import("./views/admin/order/allOrders"));
const CreateOrders = lazy(() => import("./views/admin/order/createOrders"));
const OrderHistory = lazy(() => import("./views/admin/order/orderHistory"));
const RiderTracking = lazy(() =>
  import("./views/admin/delivery/deliveryTracking")
);
const OrderTracking = lazy(() =>
  import("./views/admin/delivery/orderTracking")
);
const EmployeeDashboard = lazy(() =>
  import("./views/admin/employee/dashboard")
);
const ShiftSchedule = lazy(() =>
  import("./views/admin/employee/shiftSchedule")
);
const Absence = lazy(() => import("./views/admin/employee/absense"));
const Employee = lazy(() => import("./views/admin/employee/employees"));
const AvailableDeliveries = lazy(() =>
  import("./views/delivery/availableDeliveries")
);
const EmployeeNotification = lazy(() =>
  import("./views/employees/components/Notification")
);
const DeliveryHistory = lazy(() => import("./views/delivery/history"));
// const DeliveryDashboard = lazy(() => import("./views/delivery/dashboard"));
const DeliveryDashboard = lazy(() =>
  import("./views/employees/delivery/dashboard")
);

const EmployeeShifts = lazy(() =>
  import("./views/employees/Shift/EmployeeShifts")
);
const WaiterDashboard = lazy(() =>
  import("./views/employees/Waiter/Dashboard")
);
const WaiterAvailableOrders = lazy(() =>
  import("./views/employees/Waiter/AvailableOrders")
);
const ChefDashboard = lazy(() => import("./views/employees/Chef/Dashboard"));
const ChefAvailableOrders = lazy(() =>
  import("./views/employees/Chef/AvailableOrders")
);

const commonRoutes = [
  {
    name: "Item Management",
    layout: "/employee",
    path: "/item-management",
    icon: (
      <Icon as={MdShoppingBag} color="inherit" width="20px" height="20px" />
    ),
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
    component: <RiderTracking />,
  },
  {
    name: "Create Menu",
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
{
  /* <SidebarSection title="Dashboard" icon={<FiGrid />}>
          <SidebarLink to="/overview" icon={<FiList />} label="Overview" />
       

        <SidebarSection title="Orders" icon={<FiShoppingCart />}>
          <SidebarLink
            to="/orders/create"
            icon={<FiShoppingCart />}
            label="Create Orders"
          />
          <SidebarLink
            to="/orders/menu"
            icon={<FiList />}
            label="Create Menu"
          />
          <SidebarLink
            to="/orders/history"
            icon={<FiClipboard />}
            label="Order History"
          />
        </SidebarSection>

        <SidebarSection title="Employee Planning" icon={<FiUser />}>
          <SidebarLink
            to="/employees/overview"
            icon={<FiList />}
            label="Overview"
          />
          <SidebarLink
            to="/employees/shifts"
            icon={<FiCalendar />}
            label="Shift Schedule"
          />
          <SidebarLink
            to="/employees/absence"
            icon={<FiCalendar />}
            label="Absence"
          />
          <SidebarLink
            to="/employees/list"
            icon={<FiUser />}
            label="Employees"
          />
        </SidebarSection>

        <SidebarSection title="Delivery Partners" icon={<FiTruck />}>
          <SidebarLink
            to="/delivery-partners/overview"
            icon={<FiList />}
            label="Order Tracking"
          />

          <SidebarLink
            to="/delivery-partners/list"
            icon={<FiUser />}
            label="Rider Tracking"
          />
        </SidebarSection> */
}

export const adminRoutes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/dashboard",
    type: "list",
    icon: <FiGrid />,
    component: <MainDashboard />,
    links: [
      {
        name: "Overview",
        layout: "/admin",
        path: "/dashboard/default",
        icon: <FiList />,
        type: "link",
        component: <MainDashboard />,
      },
      // {
      //   // name: "Notifications",
      //   // layout: "/admin",
      //   // path: "/dashboard/notifications",
      //   // icon: <FiBell />,
      //   // type: "link",
      //   component: <AdminNotifications />,
      // },
    ],
  },
  {
    name: "Inventory",
    layout: "/admin",
    path: "/inventory",
    type: "list",
    icon: <FiBox />,
    component: <InventoryDashboard />,
    links: [
      {
        name: "Overview",
        layout: "/admin",
        path: "/inventory/overview",
        icon: <FiList />,
        type: "link",
        component: <InventoryDashboard />,
      },
      {
        name: "Item Management",
        layout: "/admin",
        path: "/inventory/item-management",
        icon: <FiClipboard />,
        type: "link",
        component: <ItemManagement />,
      },
      {
        name: "Stock Summary",
        layout: "/admin",
        path: "/inventory/stock-summary",
        icon: <FiPackage />,
        type: "link",
        component: <StockSummary />,
      },
      {
        name: "Supplier Management",
        layout: "/admin",
        path: "/inventory/supplier-management",
        icon: <FiUser />,
        type: "link",
        component: <SupplierManagement />,
      },
    ],
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "/orders",
    type: "list",
    icon: <FiShoppingBag />,
    links: [
      {
        name: "Create Orders",
        layout: "/admin",
        path: "/orders/create",
        type: "link",
        icon: <FiShoppingCart />,
        component: <CreateOrders />,
      },
      {
        name: "Create Menu",
        layout: "/admin",
        path: "/orders/menu",
        icon: <BiFoodMenu />,
        type: "link",
        component: <AllOrders />,
      },
      {
        name: "Order History",
        layout: "/admin",
        path: "/orders/history",
        icon: <MdOutlineHistory />,
        type: "link",
        component: <OrderHistory />,
      },
    ],
  },
  {
    name: "Employee Planning",
    layout: "/admin",
    path: "/employees",
    type: "list",
    icon: <FiUser />,
    links: [
      {
        name: "Overview",
        layout: "/admin",
        path: "/employees/overview",
        icon: <FiList />,
        type: "link",
        component: <EmployeeDashboard />,
      },
      {
        name: "Shift Schedule",
        layout: "/admin",
        path: "/employees/shifts",
        icon: <MdOutlineSchedule />,
        type: "link",
        component: <ShiftSchedule />,
      },
      {
        name: "Absences",
        layout: "/admin",
        path: "/employees/absence",
        icon: <FiCalendar />,
        type: "link",
        component: <Absence />,
      },
      {
        name: "Employees",
        layout: "/admin",
        path: "/employees/list",
        icon: <FiUser />,
        type: "link",
        component: <Employee />,
      },
    ],
  },
  {
    name: "Delivery Tracking",
    layout: "/admin",
    path: "/delivery",
    type: "list",
    icon: <FiTruck />,
    links: [
      {
        name: "Order Tracking",
        layout: "/admin",
        path: "/delivery/order-tracking",
        icon: <IoBagHandleOutline />,
        type: "link",
        component: <OrderTracking />,
      },
      {
        name: "Rider Tracking",
        layout: "/admin",
        path: "/delivery/rider-tracking",
        icon: <RiBikeLine />,
        type: "link",
        component: <RiderTracking />,
      },
      {
        name: "Create Deliveries",
        layout: "/admin",
        path: "/delivery/create-deliveries",
        icon: <MdOutlineAssignment />,
        type: "link",
        component: <>Coming Soon</>,
      },
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

  // {
  //   name: "Invoices",
  //   layout: "/admin",
  //   path: "/invoices/re-ordering",
  //   type: "list",
  //   icon: (
  //     <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
  //   ),
  //   links: [
  //     {
  //       name: "Re-Ordering",
  //       layout: "/admin",
  //       path: "/invoices/re-ordering",
  //       icon: (
  //         <Icon as={TbReorder} color="inherit" width="20px" height="20px" />
  //       ),
  //       type: "link",
  //       component: () => <></>,
  //     },
  //     {
  //       name: "Tutorial Videos",
  //       layout: "/admin",
  //       path: "/invoices/tutorial-videos",
  //       icon: (
  //         <Icon
  //           as={MdVideoLibrary}
  //           color="inherit"
  //           width="20px"
  //           height="20px"
  //         />
  //       ),
  //       type: "link",
  //       component: () => <></>,
  //     },
  //     {
  //       name: "Printer Setting",
  //       layout: "/admin",
  //       path: "/invoices/printer-setting",
  //       icon: (
  //         <Icon as={AiFillPrinter} color="inherit" width="20px" height="20px" />
  //       ),
  //       type: "link",
  //       component: () => <></>,
  //     },
  //   ],
  // },

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
  // {
  //   name: "Warehouse",
  //   layout: "/admin",
  //   path: "/warehouse",
  //   type: "list",
  //   icon: (
  //     <>
  //       <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
  //     </>
  //   ),
  //   links: [
  //     {
  //       name: "Contact Sales",
  //       layout: "/admin",
  //       path: "/warehouse/contact-sales",
  //       icon: (
  //         <Icon as={IoLockOpen} color="inherit" width="20px" height="20px" />
  //       ),
  //       type: "link",
  //       component: <></>,
  //     },
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
  //   ],
  // },
];

export const deliveryRoutes = [
  {
    name: "Delivery",
    layout: "/employee",
    path: "/delivery/dashboard",
    type: "list",
    icon: (
      <Icon as={MdChevronRight} color="inherit" width="15px" height="15px" />
    ),
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/delivery/dashboard",
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
        component: <EmployeeNotification />,
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
    component: <WaiterDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/waiter/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <WaiterDashboard />,
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
        component: <WaiterAvailableOrders />,
      },
      {
        name: "Notifications",
        layout: "/employee",
        path: "/waiter/notifications",
        type: "link",
        icon: (
          <Icon
            as={IoMdNotificationsOutline}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeNotification />,
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
    component: <ChefDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/chef/dashboard/default",
        type: "link",
        icon: (
          <Icon as={MdDashboard} color="inherit" width="15px" height="15px" />
        ),
        component: <ChefDashboard />,
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
        component: <ChefAvailableOrders />,
      },
      {
        name: "Notifications",
        layout: "/employee",
        path: "/chef/notifications",
        icon: (
          <Icon
            as={IoMdNotificationsOutline}
            color="inherit"
            width="15px"
            height="15px"
          />
        ),
        component: <EmployeeNotification />,
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
