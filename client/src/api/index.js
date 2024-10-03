import axios from "axios";
const baseURL = import.meta.env.VITE_APP_BASE_URL_FOR_APIS;

const API = axios.create({ baseURL: baseURL });

// Uncomment the following lines to add authorization token to each request
// API.interceptors.request.use((req) => {
//     if(localStorage.getItem('Profile')){
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('Profile')).token}`;
//     }
//     return req;
// });

// Authentication APIs
// Signup
export const signUpAPI = (newUser) => API.post("/auth/signup", newUser);
// Login
export const loginAPI = (userData) => API.post("/auth/login", userData);
// Login for Delivery Boy
export const loginDelivBoyAPI = (userData) =>
  API.post("/auth/login-delivboy", userData);

// Items Management APIs
// Add Item
export const AddItem = (newItem) =>
  API.post("/item-management/additem", newItem);
// Get All Items
export const GetAllItems = (localStorageId) =>
  API.get(`/item-management/get-all-items/${localStorageId}`);
// Get Single Item
export const GetSingleItem = (id) => API.get(`/item-management/get-item/${id}`);
// Update Item
export const updateSingleItem = (id, updatedItem) =>
  API.patch(`/item-management/updateitem/${id}`, updatedItem);
// Delete Item
export const deleteSingleItem = (id) =>
  API.delete(`/item-management/deleteitem/${id}`);

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
export const getAllSuppliers = (localstorageId) =>
  API.get(`/supplier/get-suppliers/${localstorageId}`);
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
export const getAllOrderItems = (localStorageId) =>
  API.get(`/orders/get-all-order-items/${localStorageId}`);
// Get Drinks Only
export const getDrinksOnly = (localStorageId) =>
  API.get(`/orders/getDrinksOnly/${localStorageId}`);
// Update Order Item
export const UpdateSingleItemOrder = (id, updatedData) =>
  API.patch(`/orders/update-order-item/${id}`, updatedData);
// Delete Order Item
export const deleteSingleItemOrder = (id) =>
  API.delete(`/orders/delete-order-item/${id}`);
// Search Order Item
export const searchOrderItem = (orderNameData, localStorageId) =>
  API.get(
    `/orders/search-order-items/${localStorageId}?orderName=${orderNameData}`
  );
// Search Drinks Only
export const searchDrinksOnly = (drinksData, localStorageId) =>
  API.get(
    `/orders/search-drinks-onlys/${localStorageId}?orderName=${drinksData}`
  );

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
export const getSingleUserData = (id) => API.get(`/user/get-user/${id}`);
// Update Single User Data Profile Pic
export const UpdateUserProfilePic = (id, updatedData) =>
  API.patch(`/user/profile-pic-update/${id}`, updatedData);

// Delivery Personnel Management APIs
// Add Delivery Personnel
export const addDeliveryPersonnel = (newPersonnel) =>
  API.post("/delivery-person/create-one", newPersonnel);
// Get All Delivery Personnel
export const getAllDeliveryPersonnels = () =>
  API.get("/delivery-person/get-all");
// Get Single Delivery Personnel
export const getSingleDeliveryPersonnel = (id) =>
  API.get(`/delivery-person/get-single/${id}`);
// Update Delivery Personnel
export const updateSingleDeliveryPersonnel = (id, updatedData) =>
  API.patch(`/delivery-person/update-del-person/${id}`, updatedData);
// Delete Delivery Personnel
export const deleteSingleDeliveryPersonnel = (id) =>
  API.delete(`/delivery-person/delete-single/${id}`);

// Complete Order Management APIs
// Add Complete Order
export const addCompleteOrderAPI = (newOrder) =>
  API.post("/complete-order/create", newOrder);
// Get All Complete Orders
export const getAllCompleteOrdersAPI = (localStorageId) =>
  API.get(`/complete-order/get-all/${localStorageId}`);
// Get Single Complete Order
export const getSingleCompleteOrderAPI = (id) =>
  API.get(`/complete-order/get-single/${id}`);
// Update Complete Order
export const updateSingleCompleteOrderAPI = (id, updatedData) =>
  API.patch(`/complete-order/update/${id}`, updatedData);
// Delete Complete Order
export const deleteSingleCompleteOrderAPI = (id) =>
  API.delete(`/complete-order/delete/${id}`);

// Dashboard APIs
// Total Stocks API
export const totalStocksAPI = () => API.get("/dashboard/total-stocks-quantity");
// Low Stocks API
export const lowStocksAPI = () => API.get("/dashboard/low-stocks-quantity");
// Expired Items API
export const expiredItemsAPI = () => API.get("/dashboard/expired-items");
// Supplier Location API
export const supplierLocationAPI = () =>
  API.get("/dashboard/supplier-location");
// Supplier Contacts API
export const supplierContactsAPI = () => API.get("/dashboard/contacts");
// Search Contacts API
export const searchContactsAPI = (contactData) =>
  API.get(`dashboard/search-contacts?nameSearched=${contactData}`);

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
export const getemployeedata = (employeeId) =>
  API.get(`/employee/get-employee/userId_${employeeId}`);
// Add Employee Data
export const postemployeedata = (data) =>
  API.post("/employee/add-employee", data);
// Update Employee Data
export const updateemployeedata = (employeedataId, data) =>
  API.put(`/employee/update-employee/${employeedataId}`, data);
// Delete Employee Data
export const deleteemployeedata = (employeedataId) =>
  API.delete(`/employee/delete-employee/${employeedataId}`);
// Get Employee Detail Data
export const employeedetaildata = (employeedataId) =>
  API.get(`/employee/get-employee/id_${employeedataId}`);

// Absence Management APIs
// Fetch Absence Details Data
export const fetchabsencedetailsdata = (employeedataId) =>
  API.get(`/absence/get-employee-leave/${employeedataId}`);
// Add Absence Data
export const addAbsencedata = (data) =>
  API.post("/absence/add-employee-leave", data);
// Edit Absence Data
export const editAbsenceData = (data) =>
  API.post("/absence/edit-employee-leave", data);
// Get Absence by Employee Data
export const getabsencebyempldata = (userId) =>
  API.get(`/absence/getEmployeesWithAbsencesByUser/${userId}`);
// Delete Absence Data
export const deleteAbsenceData = (data) =>
  API.post("/absence/delete-employee-leave", data);

// Shift Management APIs
// Add Shift Data
export const addshiftdata = (data) =>
  API.post("/shift/add-employee-shift", data);
// Edit Shift Data
export const editshiftdata = (data) =>
  API.post("/shift/edit-employee-shift", data);
// Delete Shift Data
export const deleteShiftData = (data) =>
  API.post("/shift/delete-employee-shift", data);
// Fetch Shift Details Data
export const fetchshiftdetailsdata = (employeedataId) =>
  API.get(`/shift/get-employee-shift/${employeedataId}`);
// Get Shift by Employee Data
export const getshiftbyempldata = (userId) =>
  API.get(`/shift/get-shift-with-employee/${userId}`);
