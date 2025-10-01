import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./action/userSlice";
import OrderItemReducer from "./reducers/orderItems";
import QRItemsReducer from "./reducers/qrItems";
import delBoyReducer from "./reducers/delboyReducer";
import stepperFormReducer from "./reducers/delStepperReducer";
import dineInStepperReducer from "./reducers/dineInStepperReducer";
import dineInOrderReducer from "./action/dineInOrder";
import deliveryOrderReducer from "./action/deliveryOrder";
import takeAwayOrderReducer from "./action/takeAwayOrder";
import takeAwayStepperReducer from "./reducers/takeAwayStepperReducer";
import deliveryDashboardReducer from "./reducers/deliveryDashboardReducer";
import deliveryReducer from "./reducers/deliveryReducer";
import notificationReducer from "./action/notificationSlice";
import adminReducer from "./action/admin";
import waiterReducer from "./action/waiter";
import authReducer from "./action/authSlice";
import employeeReducer from "./action/Employees/employee";
import locationReducer from "./action/location";
import chefReducer from "./action/Employees/chef";
import deliveryBoyReducer from "./action/Employees/deliveryBoy";
import cartReducer from "./action/cartItems";
import customerInfoReducer from "./action/customerInfo";

const store = configureStore({
  reducer: {
    authReducer,
    admin: adminReducer,
    userReducer,
    OrderItemReducer,
    QRItemsReducer,
    delBoyReducer,
    form: stepperFormReducer,
    deliveryOrder: deliveryOrderReducer,
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
    deliveryBoy: deliveryBoyReducer,
    cart: cartReducer,
    customerInfo: customerInfoReducer,
  },
});

export default store;
