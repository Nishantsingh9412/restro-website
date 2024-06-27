const initialState = {
    items: [],
    length: 0,
    total: 0,
}

const OrderItemReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ADD_ORDER_ITEM_TEMP':
            let addedItem = state.items.find(item => item._id === action.data._id);

            if (addedItem) {
                // Increasing the quantity of the existing item
                addedItem.quantity += 1;
                state.length += 1;
                state.total += addedItem.priceVal;
                return {...state,items: [...state.items]}
            } else {
                // Add the new item with a quantity of 1
                state.length += 1;
                state.total += action.data.priceVal;
                return {...state,items: [...state.items, {...action.data, quantity: 1}],}
            }
        case 'REMOVE_ORDER_ITEM_TEMP':
            let removedItem = state.items.find(item => item._id === action.data);
            if (removedItem && removedItem.quantity > 1) {
                // Decrease the quantity of the existing item
                removedItem.quantity -= 1;
                state.length -= 1;
                state.total -= removedItem.priceVal;
                return {...state,items: [...state.items]}
            } else {
                // Remove the item from the array
                const newItems = state.items.filter(item => item._id !== action.data);
                state.length -= 1;
                state.total -= removedItem.priceVal;
                return {...state,items: newItems}
            }
        case 'REMOVE_ORDER_ITEM_TEMP_COMPLETELY':
            const newItems = state.items.filter(item => item._id !== action.data);
            state.length = state.length - state.items.find(item => item._id === action.data).quantity ;
            state.total = state.total - (state.items.find(item => item._id === action.data).quantity * state.items.find(item => item._id === action.data).priceVal);
            return {...state,items: newItems}
        default:
            return state;
    }
}

export default OrderItemReducer;