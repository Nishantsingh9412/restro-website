import { configureStore } from "@reduxjs/toolkit";
// import adminReducer from "./reducers/adminReducer";
// import userReducer from "./reducers/user";
import userReducer from "./action/user";
import itemsReducer from "./reducers/ItemsReducer";
import stocksReducer from "./reducers/stocks";
import supplierReducer from "./reducers/supplierReducer";
import OrderItemReducer from "./reducers/orderItems";
import QRItemsReducer from "./reducers/qrItems";
import delBoyReducer from "./reducers/delboyReducer";
import stepperFormReducer from "./reducers/stepperReducer";
import compOrderReducer from "./reducers/compOrderReducer";
import dineInOrderReducer from "./reducers/dineInOrderReducer";
import dineInStepperReducer from "./reducers/dineInStepperReducer";
import takeAwayStepperReducer from "./reducers/takeAwayStepperReducer";
import deliveryDashboardReducer from "./reducers/deliveryDashboardReducer";
import deliveryReducer from "./reducers/deliveryReducer";
import notificationReducer from "./reducers/notificationReducer";
import deliveryEmpReducer from "./reducers/deliveryEmpReducer";
import adminReducer from "./action/admin";
import waiterReducer from "./action/waiter";
import authReducer from "./action/auth";

const store = configureStore({
  reducer: {
    authReducer,
    admin: adminReducer,
    userReducer,
    itemsReducer,
    stocksReducer,
    supplierReducer,
    OrderItemReducer,
    QRItemsReducer,
    delBoyReducer,
    deliveryEmpReducer,
    form: stepperFormReducer,
    compOrder: compOrderReducer,
    dineInOrder: dineInOrderReducer,
    dineInForm: dineInStepperReducer,
    takeAwayForm: takeAwayStepperReducer,
    deliveryReducer,
    deliveryDashboardReducer,
    notificationReducer,
    waiter: waiterReducer,
  },
});

export default store;
