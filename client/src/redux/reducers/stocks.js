const initialState = {
    stocks : [],
    lowStocks:[]
}
function stocksReducer(state = initialState, action){
    switch(action.type){
        case 'GET_ALL_STOCKS':
            return {...state,stocks: action.data}
        case 'GET_LOW_STOCKS':
            return {...state,lowStocks: action.data}
        default:
            return state;
    }
}
export default stocksReducer;