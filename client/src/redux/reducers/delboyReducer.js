const initialState = {
    delboyz:[],
    selectedDelBoy: null
}


const delBoyReducer = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_DELBOY':
            return {
                ...state,
                delboyz: [...state.delboyz, action.data]
            };
        case 'GET_ALL_DELBOY':
            return {
                ...state,
                delboyz: action.data
            };
        case 'GET_SINGLE_DELBOY':
            return {
                ...state,
                selectedDelBoy: action.data
            };
        case 'UPDATE_SINGLE_DELBOY':
            return {
                ...state,
                delboyz: state.delboyz.map(delboy => 
                    delboy._id === action.data._id ? action.data : delboy
                ),
            };
        default:
            return state;
    }
}

export default delBoyReducer;