import { combineReducers } from "redux";
import itemsReducer from "./ItemsReducer";
import stocksReducer from "./stocks";
import supplierReducer from "./supplierReducer";
import OrderItemReducer from "./orderItems";
import QRItemsReducer from "./qrItems";
import userReducer from "./user";
import delBoyReducer from "./delboyReducer";
// import addressReducer from "./addressReducer";
import stepperFormReducer from "./stepperReducer";
import compOrderReducer from "./compOrderReducer";
import { dineInOrderReducer } from "./dineInOrderReducer";
import dineInStepperReducer from "./dineInStepperReducer";
import takeAwayStepperReducer from "./takeAwayStepperReducer";
import deliveryDashboardReducer from "./deliveryDashboardReducer";
import deliveryReducer from "./deliveryReducer";
import notificationReducer from "./notificationReducer";
import adminReducer from "./adminReducer";
import deliveryEmpReducer from "./deliveryEmpReducer";

export default combineReducers({
  adminReducer,
  userReducer,
  itemsReducer,
  stocksReducer,
  supplierReducer,
  OrderItemReducer,
  QRItemsReducer,
  delBoyReducer,
  deliveryEmpReducer,
  // addressReducer,
  form: stepperFormReducer,
  compOrder: compOrderReducer,
  dineInOrder: dineInOrderReducer,
  dineInForm: dineInStepperReducer,
  takeAwayForm: takeAwayStepperReducer,
  deliveryReducer,
  deliveryDashboardReducer,
  notificationReducer,
});
