import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_BASE_URL_FOR_APIS });

// For Authentication
// API.interceptors.request.use((req) => {
//     if(localStorage.getItem('Profile')){
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('Profile')).token}`;
//     }
//     return req;
// });

// Auth API 
// Signup 
export const signUpAPI = (newUser) => API.post('/auth/signup', newUser); 

// Login
export const loginAPI = (userData) => API.post('/auth/login', userData); 

export const loginDelivBoyAPI = (userData) => API.post('/auth/login-delivboy', userData);




// Items API Start
// Add Item
export const AddItem = (newItem) => API.post('/item-management/additem', newItem);
// Get All Items
export const GetAllItems = () => API.get('/item-management/get-all-items');
// Get Single Item
export const GetSingleItem = (id) => API.get(`/item-management/get-item/${id}`);
// Update Item 
export const updateSingleItem = (id, updatedItem) => API.patch(`/item-management/updateitem/${id}`, updatedItem);
// Delete Item
export const deleteSingleItem = (id) => API.delete(`/item-management/deleteitem/${id}`)
// Items API End



// Stocks APi 
export const getAllStocks = () => API.get('/stock-management/get-all-stocks');

export const getLowStocks = () => API.get('/stock-management/get-low-stocks');


// Supplier API
// Add new Supplier
export const addSupplier = (newSupplier) => API.post('/supplier/add-supplier', newSupplier);
// Get All Suppliers
export const getAllSuppliers = () => API.get('/supplier/get-suppliers');
// Get Single Supplier
export const getSingleSupplier = (id) => API.get(`/supplier/get-supplier-single/${id}`)
// Update Supplier
export const UpdateSupplier = (id, updatedData) => API.patch(`/supplier/update-supplier/${id}`, updatedData);
// Delete Supplier
export const DeleteSupplier = (id) => API.delete(`/supplier/delete-supplier/${id}`);


// Orders API

// Post an Order
export const AddOrderItem = (newItem) => API.post('/orders/add-order-item', newItem);
// Get single Order Item
export const GetSingleItemOrder = (id) => API.get(`/orders/get-single-order-item/${id}`);
// Get All Orders
export const getAllOrderItems = () => API.get('/orders/get-all-order-items');
// Get Drinks Only
export const getDrinksOnly = () => API.get('/orders/getDrinksOnly')
// Update Order Item
export const UpdateSingleItemOrder = (id, updatedData) => API.patch(`/orders/update-order-item/${id}`, updatedData);
// Delete Order Item
export const deleteSingleItemOrder = (id) => API.delete(`/orders/delete-order-item/${id}`)
// Search Order Item
export const searchOrderItem = (orderNameData) => API.get(`/orders/search-order-items?orderName=${orderNameData}`);
// Search Drinks Only
export const searchDrinksOnly = (drinksData) => API.get(`/orders/search-drinks-only?orderName=${drinksData}`);


// Item Using QR 
export const postItemUsingQR = (newItem) => API.post('/qr-items/add-qr-item', newItem);

export const getSingleQRItem = (id) => API.get(`/qr-items/get-single-qr-item/${id}`);

export const getAllQRitems = () => API.get('/qr-items/get-all-qr-items');

export const upadteAllQRItems = (id, updatedData) => API.patch(`/qr-items/update-qr-item/${id}`, updatedData);

export const deleteSingleQRItem = (id) => API.delete(`/qr-items/delete-qr-item/${id}`);


// Single User Data
export const getSingleUserData = (id) => API.get(`/user/get-user/${id}`);
// Update Single User Data Profile Pic
export const UpdateUserProfilePic = (id, updatedData) => API.patch(`/user/profile-pic-update/${id}`, updatedData);


// Delivery Personnel API
// Add Delivery Personnel
export const addDeliveryPersonnel = (newPersonnel) => API.post('/delivery-person/create-one', newPersonnel);
// Get All Delivery Personnel
export const getAllDeliveryPersonnels = () => API.get('/delivery-person/get-all');
// Get Single Delivery Personnel
export const getSingleDeliveryPersonnel = (id) => API.get(`/delivery-person/get-single/${id}`);
// Update Delivery Personnel
export const updateSingleDeliveryPersonnel = (id, updatedData) => API.patch(`/delivery-person/update-del-person/${id}`, updatedData);
// Delete Delivery Personnel
export const deleteSingleDeliveryPersonnel = (id) => API.delete(`/delivery-person/delete-single/${id}`);

// Address API 
// creating new address
// export const postAddressAPI = (addressdata) => API.post('/address/post-address', addressdata);
// // get single address
// export const getSinglAddressAPI = (id) => API.get(`/address/get-single-address/${id}`);
// //update address 
// export const updateSingleAddressAPI = (id, updatedData) => API.patch(`/address/update-address/${id}`, updatedData);

// Complete Order API
// Add Complete Order
export const addCompleteOrderAPI = (newOrder) => API.post('/complete-order/create', newOrder);
// Get All Complete Orders
export const getAllCompleteOrdersAPI = () => API.get('/complete-order/get-all');
// Get Single Complete Order
export const getSingleCompleteOrderAPI = (id) => API.get(`/complete-order/get-single/${id}`);
// Update Complete Order
export const updateSingleCompleteOrderAPI = (id, updatedData) => API.patch(`/complete-order/update/${id}`, updatedData);
// Delete Complete Order
export const deleteSingleCompleteOrderAPI = (id) => API.delete(`/complete-order/delete/${id}`);
