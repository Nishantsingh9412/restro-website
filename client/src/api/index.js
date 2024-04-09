import axios from 'axios';

const API = axios.create({ baseURL:process.env.REACT_APP_BASE_URL_FOR_APIS});

// For Authentication
// API.interceptors.request.use((req) => {
//     if(localStorage.getItem('Profile')){
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('Profile')).token}`;
//     }
//     return req;
// });
                            // Items API Start
// Add Item
export const AddItem = (newItem) => API.post('/item-management/additem', newItem);
// Get All Items
export const GetAllItems = () => API.get('item-management/get-all-items');
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
export const UpdateSupplier = (id,updatedData) => API.patch(`/supplier/update-supplier/${id}`, updatedData);
// Delete Supplier
export const DeleteSupplier = (id) => API.delete(`/supplier/delete-supplier/${id}`);




