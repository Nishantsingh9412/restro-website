import { combineReducers } from "redux";
import itemsReducer from "./ItemsReducer";
import stocksReducer from "./stocks";
import supplierReducer from "./supplierReducer";
import OrderItemReducer from "./orderItems";
import QRItemsReducer from "./qrItems";
import authReducer from "./auth";
import userReducer from "./user";
import delBoyReducer from "./delboyReducer";
// import addressReducer from "./addressReducer";
import stepperFormReducer from "./stepperReducer";
import compOrderReducer from "./compOrderReducer";
import deliveryReducer from "./deliveryReducer";
import notificationReducer from "./notificationReducer";
import deliveryDashboardReducer from "./deliveryDashboardReducer";

export default combineReducers({
    authReducer,
    userReducer,
    itemsReducer,
    stocksReducer,
    supplierReducer,
    OrderItemReducer,
    QRItemsReducer,
    delBoyReducer,
    // addressReducer,
    form:stepperFormReducer,
    compOrder:compOrderReducer,
    deliveryReducer,
    notificationReducer,
    deliveryDashboardReducer
})