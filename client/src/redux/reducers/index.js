import { combineReducers } from "redux";
import itemsReducer from "./ItemsReducer";
import stocksReducer from "./stocks";


export default combineReducers({
    itemsReducer,stocksReducer
})