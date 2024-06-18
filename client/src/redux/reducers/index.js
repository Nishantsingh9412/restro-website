import { combineReducers } from "redux";
import itemsReducer from "./ItemsReducer";
import stocksReducer from "./stocks";
import supplierReducer from "./supplierReducer";
import OrderItemReducer from "./orderItems";
import QRItemsReducer from "./qrItems";
import authReducer from "./auth";

export default combineReducers({
    authReducer,
    itemsReducer,
    stocksReducer,
    supplierReducer,
    OrderItemReducer,
    QRItemsReducer

})