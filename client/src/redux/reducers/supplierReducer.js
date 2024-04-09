const initialState = {
    suppliers:[],
    seletectedSupplier: null
}

const supplierReducer = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_SUPPLIER':
            return {
                ...state,
                suppliers: [...state.suppliers, action.data]
            }
        case 'GET_ALL_SUPPLIERS':
            return {
                ...state,
                suppliers: action.data
            }
        case 'GET_SINGLE_SUPPLIER':
            return {
                ...state,
                seletectedSupplier: action.data
            }
        case 'UPDATE_SUPPLIER':
            return {
                ...state,
                suppliers: state.suppliers.map(supplier => 
                    supplier._id === action.data._id ? action.data : supplier
                )
            }
        default:
            return state;
    }
}

export default supplierReducer;