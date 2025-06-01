import axios from "axios";
import { localStorageData } from "../utils/constant";
const baseURL = import.meta.env.VITE_APP_BASE_URL_FOR_APIS;

const API = axios.create({ baseURL });

API.interceptors.request.use(
  (req) => {
    const profile = localStorage.getItem(localStorageData.PROFILE_DATA);
    if (profile) {
      const { token } = JSON.parse(profile);
      if (token) req.headers.Authorization = `Bearer ${token}`;
    }
    if (!(req.data instanceof FormData)) {
      req.headers["Content-Type"] = "application/json";
    }
    return req;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      const { status, data } = response;
      if (status === 401) {
        localStorage.removeItem(localStorageData.PROFILE_DATA);
        window.location.href = "/";
      } else if (status === 403) {
        console.error("Forbidden: Access denied.");
      } else if (status === 404) {
        console.error("Not Found: Resource unavailable.");
      } else if (status === 500) {
        // Log server error message if available
        if (data && data.message) {
          console.error(`Server Error: ${data.message}`);
        } else {
          console.error("Server Error: Try again later.");
        }
      } else if (data && data.message) {
        // Log any other server error messages
        console.error(`Error: ${data.message}`);
      }
    } else {
      console.error("Network error or no response from server.");
    }
    return Promise.reject(error?.response?.data || error);
  }
);

export default API;
// Authentication APIs
// Signup
export const signUpAPI = (newUser) => API.post("/auth/signup", newUser);
// Login
export const loginAPI = (userData) => API.post("/auth/login", userData);
// Login for Delivery Boy
export const loginEmployee = (userData) =>
  API.post("/auth/login-employee", userData);

// Admin APIs
// Get Admin Data
export const getAdminData = () => API.get(`/admin/get-admin`);
// Update Admin Profile Pic
export const updateAdminProfilePic = (updatedData) =>
  API.patch(`/admin/update-profile-pic`, updatedData);
// Add Restaurant Details
export const addRestaurantDetails = (newRestaurant) =>
  API.post("/admin/add-restaurant", newRestaurant);

// Dashboard APIs
export const getAdminDashboardData = () =>
  API.get(`/dashboard/admin-dashboard`);
// Get Contacts
export const getSupplierContacts = () =>
  API.get(`/dashboard/supplier-contacts`);

//common apis
// Get Employee
export const getEmployeeData = () => API.get(`/common/get-employee`);
// Get shifts by employee
export const getEmployeeShifts = () => API.get(`/common/get-all-shifts`);
// Update Employee Profile Pic
export const updateEmployeeProfilePic = (updatedData) =>
  API.patch(`/common/update-profile-pic`, updatedData);
// Update Employee Availability Status
export const updateEmployeeOnlineStatus = (updatedData) =>
  API.put(`/common/update-online-status`, updatedData);

// Inventory Management APIs
//Get Inventory Dashboard Data
export const getInventoryDashboardData = () =>
  API.get("/inventory-dashboard/get-dashboard-data");
// Add Item
export const addInventoryItem = (newItem) =>
  API.post("/inventory/add-item", newItem);
// Get All Items
export const getAllInventoryItems = () => API.get(`/inventory/get-all-items`);
// Get Single Item
export const getSingleItem = (id) => API.get(`/inventory/get-item/${id}`);
// Update Item
export const updateInventoryItem = (id, updatedItem) =>
  API.patch(`/inventory/update-item/${id}`, updatedItem);
// Delete Item
export const deleteInventoryItem = (id) =>
  API.delete(`/inventory/delete-item/${id}`);
// Use Item
export const reduceInventoryItem = (id, updatedData) =>
  API.patch(`/inventory/use-item/${id}`, updatedData);
// Stocks Management APIs
// Get All Stocks
export const getAllStocks = (localstorageId) =>
  API.get(`/stock-management/get-all-stocks/${localstorageId}`);
// Get Low Stocks
export const getLowStocks = (localstorageId) =>
  API.get(`/stock-management/get-low-stocks/${localstorageId}`);

// Supplier Management APIs
// Add new Supplier
export const addSupplier = (newSupplier) =>
  API.post("/supplier/add-supplier", newSupplier);
// Get All Suppliers
export const getAllSuppliers = () => API.get(`/supplier/get-all-suppliers`);
// Get Suppliers Contacts
export const getSupplierContactsAPI = () =>
  API.get(`/supplier/get-supplier-contacts`);
// Get Single Supplier
export const getSingleSupplier = (id) =>
  API.get(`/supplier/get-supplier-single/${id}`);
// Update Supplier
export const UpdateSupplier = (id, updatedData) =>
  API.patch(`/supplier/update-supplier/${id}`, updatedData);
// Delete Supplier
export const DeleteSupplier = (id) =>
  API.delete(`/supplier/delete-supplier/${id}`);

// Orders Management APIs
// Post an Order
export const AddOrderItem = (newItem) =>
  API.post("/orders/add-order-item", newItem);
// Get single Order Item
export const GetSingleItemOrder = (id) =>
  API.get(`/orders/get-single-order-item/${id}`);
// Get All Orders
export const getAllOrderItems = () => API.get(`/orders/get-all-order-items`);

// Update Order Item
export const UpdateSingleItemOrder = (id, updatedData) =>
  API.patch(`/orders/update-order-item/${id}`, updatedData);
// Delete Order Item
export const deleteSingleItemOrder = (id) =>
  API.delete(`/orders/delete-order-item/${id}`);

// Allot order to personnels (Delivery, Waiter, Chef)
export const getPersonnelsBySupplier = (order, personnelsType) => {
  return API.get(`/orders/get-personnels-by-role/${personnelsType}/${order}`);
};
// QR Item Management APIs
// Add Item Using QR
export const postItemUsingQR = (newItem) =>
  API.post("/qr-items/add-qr-item", newItem);
// Get Single QR Item
export const getSingleQRItem = (id) =>
  API.get(`/qr-items/get-single-qr-item/${id}`);
// Get All QR Items
export const getAllQRitems = () => API.get("/qr-items/get-all-qr-items");
// Update QR Item
export const upadteAllQRItems = (id, updatedData) =>
  API.patch(`/qr-items/update-qr-item/${id}`, updatedData);
// Delete QR Item
export const deleteSingleQRItem = (id) =>
  API.delete(`/qr-items/delete-qr-item/${id}`);

// User Data APIs
// Get Single User Data
export const getSingleUserData = () => API.get(`/user/get-user`);
// Update Single User Data Profile Pic
export const UpdateUserProfilePic = (updatedData) =>
  API.patch(`/user/profile-pic-update`, updatedData);
// Delivery Employee Date APIs
export const getAllDeliveryEmpAPI = () =>
  API.get(`/employee/get-delivery-employees`);
// Delivery Personnel Management APIs
// Add Delivery Personnel
export const addDeliveryPersonnel = (newPersonnel) =>
  API.post("/delivery-person/create-one", newPersonnel);
// Get All Delivery Personnel
export const getAllDeliveryPersonnels = () =>
  API.get("/delivery-person/get-all");
// Get All Delivery Personnel by supplier
export const getDeliveryPersonnelsBySupplier = (personnelType) =>
  API.get(`/delivery-person/get-by-supplier/${personnelType}`);
// Get Single Delivery Personnel
export const getSingleDeliveryPersonnel = (id) =>
  API.get(`/delivery-person/get-single/${id}`);
// Update Delivery Personnel
export const updateSingleDeliveryPersonnel = (id, updatedData) =>
  API.patch(`/delivery-person/update-del-person/${id}`, updatedData);
// Update Delivery Personnel Status
export const updateDeliveryPersonnelStatus = (id, updatedData) =>
  API.patch(`/delivery-person/change-online-status/${id}`, updatedData);

// Delete Delivery Personnel
export const deleteSingleDeliveryPersonnel = (id) =>
  API.delete(`/delivery-person/delete-single/${id}`);

// Update Odometer Reading
export const updateOdometerReading = (updatedData) =>
  API.put(`/delivery-person/update-odometer`, updatedData);

// Toggle Delivery Personnel Availability
export const toggleDeliveryPersonnelAvailability = () =>
  API.patch(`/delivery-person/toggle-availability`);
// delivery Order Management APIs
// Add delivery Order
export const addDeliveryOrderAPI = (newOrder) =>
  API.post("/delivery-order/create-order", newOrder);
// Get All delivery Orders
export const getAllDeliveryOrdersAPI = () =>
  API.get(`/delivery-order/get-all-delivery-orders`);
// Get Single delivery Order
export const getSingleDeliveryOrderAPI = (id) =>
  API.get(`/delivery-order/get-single/${id}`);
// Update delivery Order
export const updateSingleDeliveryOrderAPI = (id, updatedData) =>
  API.patch(`/delivery-order/update/${id}`, updatedData);
// Delete delivery Order
export const deleteSingleDeliveryOrderAPI = (id) =>
  API.delete(`/delivery-order/delete/${id}`);
//Allot Order to the Delivery boy
export const allotDeliveryBoyAPI = (orderId, deliveryBoyId) =>
  API.post(`/delivery-order/allot-delivery/${orderId}`, {
    deliveryBoyId,
  });
// Send Delivery Offer
export const sendDeliveryOfferAPI = ({ id, deliveryBoyIds }) =>
  API.post(`/delivery-order/send-delivery-offer/${id}`, {
    deliveryBoyIds,
  });

// Get Delivery Employees
export const getDeliveryBoys = (orderId) =>
  API.get(`/delivery-order/get-delivery-employees/${orderId}`);

// Dine-In Order Management APIs
// Add Dine-In Order
export const addDineInOrderAPI = (newOrder) =>
  API.post("/dine-in/create-dine-in", newOrder);
// Get All Dine-In Orders
export const getAllDineInOrdersAPI = () =>
  API.get(`/dine-in/get-all-dine-orders`);
// Get Single Dine-In Order
export const getSingleDineInOrderAPI = (id) =>
  API.get(`/dine-in/get-single/${id}`);
// Update Dine-In Order
export const updateSingleDineInOrderAPI = (id, updatedData) =>
  API.patch(`/dine-in/update/${id}`, updatedData);
// Delete Dine-In Order
export const deleteSingleDineInOrderAPI = (id) =>
  API.delete(`/dine-in-order/delete/${id}`);
// Allot Dine-In Order to Waiter
export const allotDineInOrderToWaiter = (orderId, waiterId) =>
  API.post(`/dine-in/assign-to-waiter/${orderId}`, {
    waiterId: waiterId,
  });
// Allot Dine-In Order to Chef
export const allotDineInOrderToChef = (orderId, chefId) =>
  API.post(`/dine-in/assign-to-chef/${orderId}`, {
    chefId: chefId,
  });

// Update Dine-In Order Status
export const updateDineInOrderStatus = (orderId, updatedData) =>
  API.patch(`/dine-in/update-order-status/${orderId}`, updatedData);

// Take Away Order Management APIs
// Add Take Away Order
export const addTakeAwayOrderAPI = (newOrder) =>
  API.post("/take-away/create-take-away", newOrder);
// Get All Take Away Orders
export const getAllTakeAwayOrdersAPI = () =>
  API.get(`/take-away/get-all-take-away`);
// Get Single Take Away Order
export const getSingleTakeAwayOrderAPI = (id) =>
  API.get(`/take-away/get-single/${id}`);
// Update Take Away Order
export const updateSingleTakeAwayOrderAPI = (id, updatedData) =>
  API.patch(`/take-away/update/${id}`, updatedData);
// Delete Take Away Order
export const deleteSingleTakeAwayOrderAPI = (id) =>
  API.delete(`/take-away/delete/${id}`);

// Allot Take-Away Order to Chef
export const allotTakeAwayOrderToChef = (orderId, chefId) =>
  API.post(`/take-away/assign-to-chef/${orderId}`, {
    chefId: chefId,
  });

// Update Take-Away Order Status
export const updateTakeAwayOrderStatus = (orderId, updatedData) =>
  API.patch(`/take-away/update-order-status/${orderId}`, updatedData);

// Employee Management APIs
// Assign Task
export const assignTaskAPI = (newTask) =>
  API.post("/employee/assign-task", newTask);
// Get All Tasks
export const getAllTasksAPI = () => API.get("/employee/tasks");
// Get All Employees Assigned To
export const getALLEmployeesAssignedToAPI = (id) =>
  API.get(`/employee/tasks-assigned-to-employee/${id}`);
// Get All Employees
export const AllEmployeesAPI = () => API.get("/employee/all-employees");
// Delete Single Task
export const deleteTaskAPI = (taskId) =>
  API.delete(`/employee/delete-single-task/${taskId}`);
// Update Single Task
export const updateTaskAPI = (taskId, updatedData) =>
  API.patch(`/employee/update-task/${taskId}`, updatedData);

// Employee Data APIs
// Get Absent Data
export const getAbsentdata = (employeeId) =>
  API.get(`/absence/get-todays-leave/${employeeId}`);
// Get Employee Shift Data
export const getemployeshiftdata = () => API.get("/shift/get-todays-shift");
// Get Today's Employee Birthday Data
export const getbirthdayapidata = () =>
  API.get("/employee/get-todays-employee-birthday");
// Get Upcoming Employee Birthday Data
export const getupcomingbirthdayapidata = () =>
  API.get("/employee/get-upcoming-employee-birthday");
// Get Employee Data
export const getEmployeeAPI = () => API.get(`/employee/get-all-employee`);
// Get Online Employees by role
export const getOnlineEmployeesByRole = (role) =>
  API.get(`/employee/get-online-employees/${role}`);
// Add Employee Data
export const addNewEmployeeAPI = (data) =>
  API.post("/employee/add-employee", data);
// Update Employee Data
export const updateEmployeeAPI = (employeedataId, data) =>
  API.put(`/employee/update-employee/${employeedataId}`, data);
// Delete Employee Data
export const deleteEmployeeAPI = (employeedataId) =>
  API.delete(`/employee/delete-employee/${employeedataId}`);
// Get Employee Detail Data
export const getEmployeeDetailsAPI = (employeedataId) =>
  API.get(`/employee/get-employee/${employeedataId}`);

// Absence Management APIs
// Fetch Absence Details Data
export const fetchabsencedetailsdata = (employeedataId) =>
  API.get(`/absence/get-employee-leave/${employeedataId}`);
// Add Absence Data
export const addAbsenceData = (data) =>
  API.post("/absence/add-employee-leave", data);
// Edit Absence Data
export const editAbsenceData = (data) =>
  API.post("/absence/edit-employee-leave", data);
// Get Absence by Employee Data
export const getAbsenceByEmpl = () =>
  API.get(`/absence/get-all-employee-leave`);
// Delete Absence Data
export const deleteAbsenceData = (data) =>
  API.post("/absence/delete-employee-leave", data);

// Shift Management APIs
// Add Shift Data
export const addShiftData = (data) =>
  API.post("/shift/add-employee-shift", data);
// Edit Shift Data
export const editShiftData = (data) =>
  API.post("/shift/edit-employee-shift", data);
// Delete Shift Data
export const deleteShiftData = (data) =>
  API.post("/shift/delete-employee-shift", data);
// Fetch Shift Details Data
export const fetchshiftdetailsdata = (employeedataId) =>
  API.get(`/shift/get-employee-shift/${employeedataId}`);
// Get Shift by Employee Data
export const getShiftByEmpl = () => API.get(`/shift/get-shift-with-employee`);

// Delivery API
// Get All Deliveries
export const getAllDeliveries = () => API.get("/delivery/get-all-order");
// Get Active Delivery
export const getActiveDelivery = () => API.get("/delivery/get-active-order");
// Get Single Delivery
export const getSingleDelivery = (id) => API.get(`/delivery/get-single/${id}`);
// Get Completed Delivery
export const getCompletedDeliveries = () => API.get(`/delivery/get-completed`);
// Add Delivery
export const addDelivery = (newDelivery) =>
  API.post("/delivery/create-one", newDelivery);
// Update Delivery
export const updateSingleDelivery = (id, updatedData) =>
  API.patch(`/delivery/update-single/${id}`, updatedData);
// Update Delivery Status
export const updateDeliveryStatus = (id, updatedData) =>
  API.patch(`/delivery/update-status/${id}`, updatedData);
// Cancel Delivery
export const cancelDelivery = (id) => API.post(`/delivery/cancel/${id}`);
// Delete Delivery
export const deleteSingleDelivery = (id) =>
  API.delete(`/delivery/delete-single/${id}`);
// Delivery Dashboard API
export const getDeliveryDashboardData = () =>
  API.get(`/delivery-dashboard/get-dashboard-data`);

// Map API
export const getDirections = async (options) => await axios.request(options);

// Notificaiton API
export const getAllNotifications = () => API.get("/notification/get-all");

export const getNotificationsByUser = () =>
  API.get(`/notification/get-emp-notification`);

export const getNotificationByAdmin = () =>
  API.get(`/notification/get-admin-notification`);

//Employees
// Waiter
// Get Waiter Dashboard Data
export const getWaiterDashboardData = () =>
  API.get("/waiter/get-dashboard-data");

//Get Waiter All Orders
export const getWaiterAllOrders = () => API.get("/waiter/get-all-orders");

// Get Waiter Active Orders
export const getWaiterActiveOrder = () => API.get("/waiter/get-active-order");

// Chef
// Get Chef Dashboard Data
export const getChefDashboardData = () => API.get("/chef/get-dashboard-data");
// Get Chef All Orders
export const getChefAllOrders = () => API.get("/chef/get-all-orders");
// Get Chef Active Orders
export const getChefActiveOrder = () => API.get("/chef/get-active-order");
