import { combineReducers } from "redux";
import itemsReducer from "./ItemsReducer";
import stocksReducer from "./stocks";
import supplierReducer from "./supplierReducer";
import OrderItemReducer from "./orderItems";


export default combineReducers({
    itemsReducer,
    stocksReducer,
    supplierReducer,
    OrderItemReducer,
})