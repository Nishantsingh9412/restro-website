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
  import("./views/employees/delivery/availableDeliveries")
);
const EmployeeNotification = lazy(() =>
  import("./views/employees/components/Notification")
);
const DeliveryHistory = lazy(() =>
  import("./views/employees/delivery/history")
);
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
    icon: <MdShoppingBag />,
    component: <ItemManagement />,
  },
  {
    name: "Employees",
    layout: "/employee",
    path: "/employees",
    icon: <MdHistory />,
    component: <Employee />,
  },
  {
    name: "Delivery Tracking",
    layout: "/employee",
    path: "/delivery-tracking",
    icon: <MdLocalShipping />,
    component: <RiderTracking />,
  },
  {
    name: "Create Menu",
    layout: "/employee",
    path: "/orders",
    icon: <MdRestaurant />,
    component: <AllOrders />,
  },
  {
    name: "Order History",
    layout: "/employee",
    path: "/order-history",
    icon: <MdHistory />,
    component: <OrderHistory />,
  },
];

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
];

// Delivery Employee Routes
export const deliveryRoutes = [
  {
    name: "Delivery",
    layout: "/employee",
    path: "/delivery/dashboard",
    type: "list",
    icon: <MdChevronRight />,
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/delivery/dashboard",
        type: "link",
        icon: <MdDashboard />,
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Deliveries",
        layout: "/employee",
        path: "/delivery/available-deliveries",
        type: "link",
        icon: <MdOutlineDeliveryDining />,
        component: <AvailableDeliveries />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/delivery/available-shifts",
        type: "link",
        icon: <MdOutlineDeliveryDining />,
        component: <EmployeeShifts />,
      },
      {
        name: "Notifications",
        layout: "/employee",
        path: "/delivery/notifications",
        type: "link",
        icon: <IoMdNotificationsOutline />,
        component: <EmployeeNotification />,
      },
      {
        name: "History",
        layout: "/employee",
        path: "/delivery/history",
        type: "link",
        icon: <MdHistory />,
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
    icon: <MdChevronRight />,
    component: <WaiterDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/waiter/dashboard/default",
        type: "link",
        icon: <MdDashboard />,
        component: <WaiterDashboard />,
      },
      {
        name: "Available Orders",
        layout: "/employee",
        path: "/waiter/available-orders",
        icon: <MdOutlineDeliveryDining />,
        component: <WaiterAvailableOrders />,
      },
      {
        name: "Notifications",
        layout: "/employee",
        path: "/waiter/notifications",
        type: "link",
        icon: <IoMdNotificationsOutline />,
        component: <EmployeeNotification />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/waiter/available-shifts",
        type: "link",
        icon: <MdOutlineDeliveryDining />,
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
    icon: <MdChevronRight />,
    component: <ChefDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/chef/dashboard/default",
        type: "link",
        icon: <MdDashboard />,
        component: <ChefDashboard />,
      },
      {
        name: "Available Orders",
        layout: "/employee",
        path: "/chef/available-orders",
        icon: <MdOutlineDeliveryDining />,
        component: <ChefAvailableOrders />,
      },
      {
        name: "Notifications",
        layout: "/employee",
        path: "/chef/notifications",
        icon: <IoMdNotificationsOutline />,
        component: <EmployeeNotification />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/chef/available-shifts",
        type: "link",
        icon: <MdOutlineDeliveryDining />,
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];

// Manager Employee Routes
export const managerRoutes = [
  {
    name: "Manager",
    layout: "/employee",
    path: "/manager/dashboard/default",
    type: "list",
    icon: <MdChevronRight />,
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/manager/dashboard/default",
        type: "link",
        icon: <MdDashboard />,
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/manager/available-shifts",
        type: "link",
        icon: <MdOutlineDeliveryDining />,
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
    icon: <MdChevronRight />,
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/bar/dashboard/default",
        type: "link",
        icon: <MdDashboard />,
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/bar/available-shifts",
        type: "link",
        icon: <MdOutlineDeliveryDining />,
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];

// Staff Employee Routes
export const staffRoutes = [
  {
    name: "Staff",
    layout: "/employee",
    path: "/staff/dashboard/default",
    type: "list",
    icon: <MdChevronRight />,
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/staff/dashboard/default",
        type: "link",
        icon: <MdDashboard />,
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/staff/available-shifts",
        type: "link",
        icon: <MdOutlineDeliveryDining />,
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
    icon: <MdChevronRight />,
    component: <DeliveryDashboard />,
    links: [
      {
        name: "Dashboard",
        layout: "/employee",
        path: "/helper/dashboard/default",
        type: "link",
        icon: <MdDashboard />,
        component: <DeliveryDashboard />,
      },
      {
        name: "Available Shifts",
        layout: "/employee",
        path: "/helper/available-shifts",
        type: "link",
        icon: <MdOutlineDeliveryDining />,
        component: <EmployeeShifts />,
      },
      ...commonRoutes,
    ],
  },
];
