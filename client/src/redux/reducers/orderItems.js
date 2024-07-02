// const initialState = {
//     items: [],
//     length: 0,
//     total: 0,
// }

// const OrderItemReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'ADD_ORDER_ITEM_TEMP':
//             let addedItem = state.items.find(item => item._id === action.data._id);

//             if (addedItem) {
//                 // Increasing the quantity of the existing item
//                 addedItem.quantity += 1;
//                 state.length += 1;
//                 state.total += addedItem.priceVal;
//                 return { ...state, items: [...state.items] }
//             } else {
//                 // Add the new item with a quantity of 1
//                 state.length += 1;
//                 state.total += action.data.priceVal;
//                 return { ...state, items: [...state.items, { ...action.data, quantity: 1 }], }
//             }
//         case 'REMOVE_ORDER_ITEM_TEMP':
//             let removedItem = state.items.find(item => item._id === action.data);
//             if (removedItem && removedItem.quantity > 1) {
//                 // Decrease the quantity of the existing item
//                 removedItem.quantity -= 1;
//                 state.length -= 1;
//                 state.total -= removedItem.priceVal;
//                 return { ...state, items: [...state.items] }
//             } else {
//                 // Remove the item from the array
//                 const newItems = state.items.filter(item => item._id !== action.data);
//                 state.length -= 1;
//                 state.total -= removedItem.priceVal;
//                 return { ...state, items: newItems }
//             }
//         case 'REMOVE_ORDER_ITEM_TEMP_COMPLETELY':
//             const newItems = state.items.filter(item => item._id !== action.data);
//             state.length = state.length - state.items.find(item => item._id === action.data).quantity;
//             state.total = state.total - (state.items.find(item => item._id === action.data).quantity * state.items.find(item => item._id === action.data).priceVal);
//             return { ...state, items: newItems }
//         case 'RESET_ORDER_ITEM_TEMP':
//             return { ...initialState, items: [...initialState.items], length: initialState.length, total: initialState.total };
//         default:
//             return state;
//     }
// }

// export default OrderItemReducer;


const initialState = {
    items: [],
    length: 0,
    total: 0,
}

const OrderItemReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ORDER_ITEM_TEMP': {
            const existingItem = state.items.find(item => item._id === action.data._id);

            if (existingItem) {
                const updatedItems = state.items.map(item =>
                    item._id === action.data._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    ...state,
                    items: updatedItems,
                    length: state.length + 1,
                    total: state.total + existingItem.priceVal,
                };
            } else {
                const newItem = { ...action.data, quantity: 1 };
                return {
                    ...state,
                    items: [...state.items, newItem],
                    length: state.length + 1,
                    total: state.total + newItem.priceVal,
                };
            }
        }
        case 'REMOVE_ORDER_ITEM_TEMP': {
            const existingItem = state.items.find(item => item._id === action.data);

            if (existingItem) {
                if (existingItem.quantity > 1) {
                    const updatedItems = state.items.map(item =>
                        item._id === action.data
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                    return {
                        ...state,
                        items: updatedItems,
                        length: state.length - 1,
                        total: state.total - existingItem.priceVal,
                    };
                } else {
                    const updatedItems = state.items.filter(item => item._id !== action.data);
                    return {
                        ...state,
                        items: updatedItems,
                        length: state.length - 1,
                        total: state.total - existingItem.priceVal,
                    };
                }
            }
            return state;
        }
        case 'REMOVE_ORDER_ITEM_TEMP_COMPLETELY': {
            const existingItem = state.items.find(item => item._id === action.data);
            if (existingItem) {
                const updatedItems = state.items.filter(item => item._id !== action.data);
                return {
                    ...state,
                    items: updatedItems,
                    length: state.length - existingItem.quantity,
                    total: state.total - (existingItem.quantity * existingItem.priceVal),
                };
            }
            return state;
        }
        case 'RESET_ORDER_ITEM_TEMP': {
            return initialState;
        }
        default:
            return state;
    }
}

export default OrderItemReducer;
