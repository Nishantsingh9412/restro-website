// import * as api from '../../api/index.js';

// export const setAddressAction = (addressData) => async (dispatch) => {
//     try {
//         const { data } = await api.postAddressAPI(addressData);
//         dispatch({ type: 'SET_ADDRESS', data: data?.result });
//         return { success: true, message: 'address set successfully' };
//     } catch (err) {
//         console.log("Error from courseFilter Action: " + err.message, err.stack);
//         return { success: false, message: err?.response?.data?.message };
//     }
// }

// export const getAddressAction = (id) => async (dispatch) => {
//     try{
//         const {data} = await api.getSinglAddressAPI(id);
//         dispatch({type: 'GET_ADDRESS', data: data?.result});
//         return {success: true, message: 'address fetched successfully'};
//     }catch(err){
//         console.log("Error from courseFilter Action: " + err.message, err.stack);
//         return { success: false, message: err?.response?.data?.message };
//     }
// }

// export const updateAddressAction = (id, addressData) => async (dispatch) => {
//     try {
//         const { data } = await api.updateSingleAddressAPI(id, addressData);
//         dispatch({ type: 'UPDATE_ADDRESS', data: data?.result });
//         return { success: true, message: 'address updated successfully' };
//     } catch (err) {
//         console.log("Error from courseFilter Action: " + err.message, err.stack);
//         return { success: false, message: err?.response?.data?.message };
//     }
// }
