const initialState = {
    items: [],
}

const OrderItemReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ADD_ORDER_ITEM_TEMP':
            let addedItem = state.items.find(item => item._id === action.data._id);
            if (addedItem) {
                // Increase the quantity of the existing item
                addedItem.quantity += 1;
                return {...state,items: [...state.items]}
            } else {
                // Add the new item with a quantity of 1
                return {...state,items: [...state.items, {...action.data, quantity: 1}],}
            }
        case 'REMOVE_ORDER_ITEM_TEMP':
            let removedItem = state.items.find(item => item._id === action.data);
            if (removedItem && removedItem.quantity > 1) {
                // Decrease the quantity of the existing item
                removedItem.quantity -= 1;
                return {...state,items: [...state.items]}
            } else {
                // Remove the item from the array
                const newItems = state.items.filter(item => item._id !== action.data);
                return {...state,items: newItems}
            }
        case 'REMOVE_ORDER_ITEM_TEMP_COMPLETELY':
            const newItems = state.items.filter(item => item._id !== action.data);
            return {...state,items: newItems}
        default:
            return state;
    }
}

export default OrderItemReducer;