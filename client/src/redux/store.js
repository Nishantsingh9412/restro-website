import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./action/user";
import itemsReducer from "./reducers/ItemsReducer";
import stocksReducer from "./reducers/stocks";
import supplierReducer from "./reducers/supplierReducer";
import OrderItemReducer from "./reducers/orderItems";
import QRItemsReducer from "./reducers/qrItems";
import delBoyReducer from "./reducers/delboyReducer";
import stepperFormReducer from "./reducers/stepperReducer";
import deliveryOrderReducer from "./reducers/deliveryOrderReducer";
import dineInOrderReducer from "./reducers/dineInOrderReducer";
import dineInStepperReducer from "./reducers/dineInStepperReducer";
import takeAwayOrderReducer from "./reducers/takeAwayOrderReducer";
import takeAwayStepperReducer from "./reducers/takeAwayStepperReducer";
import deliveryDashboardReducer from "./reducers/deliveryDashboardReducer";
import deliveryReducer from "./reducers/deliveryReducer";
import notificationReducer from "./reducers/notificationReducer";
import deliveryEmpReducer from "./reducers/deliveryEmpReducer";
import adminReducer from "./action/admin";
import waiterReducer from "./action/waiter";
import authReducer from "./action/auth";
import employeeReducer from "./action/Employees/employee";
import locationReducer from "./action/location";
import chefReducer from "./action/Employees/chef";

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
    compOrder: deliveryOrderReducer,
    dineInOrder: dineInOrderReducer,
    takeAwayOrder: takeAwayOrderReducer,
    dineInForm: dineInStepperReducer,
    takeAwayForm: takeAwayStepperReducer,
    deliveryReducer,
    deliveryDashboardReducer,
    notificationReducer,
    waiter: waiterReducer,
    employee: employeeReducer,
    location: locationReducer,
    chef: chefReducer,
  },
});

export default store;
