// const initialState = {
//     items: [],
//     selectedItem: null,
// };

// function itemsReducer(state = initialState, action) {
//     switch (action.type) {
//         case 'ADD_ITEM':
//             return {
//                 ...state,
//                 items: [...state.items, action.data],
//             };
//         case 'GET_ALL_ITEMS':
//             return {
//                 ...state,
//                 items: action.data,
//             };
//         case 'GET_SINGLE_ITEM':
//             return {
//                 ...state,
//                 selectedItem: action.data,
//             };
//         case 'UPDATE_SINGLE_ITEM':
//             return {
//                 ...state,
//                 items: state.items.map(item =>
//                     item._id === action.data._id ? action.data : item
//                 ),
//             };
//         default:
//             return state;
//     }
// };

// export default itemsReducer;
