const initialState = {
    items: [],
    selectedItem: null
}

const QRItemsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_QR_ITEM':
            return {
                ...state,
                items: [...state.items, action.data]
            };
        case 'GET_ALL_QR_ITEMS':
            return {
                ...state,
                items: action.data
            };
        case 'GET_SINGLE_QR_ITEM':
            return {
                ...state,
                selectedItem: action.data
            };
        case 'UPDATE_SINGLE_QR_ITEM':
            return {
                ...state,
                items: state.items.map(item =>
                    item._id === action.data._id ? action.data : item
                )
            };
        default:
            return state;
    }
}

export default QRItemsReducer;