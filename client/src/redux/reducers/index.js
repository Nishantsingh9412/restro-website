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
import { dineInOrderReducer } from "./dineInOrderReducer";
import dineInStepperReducer from "./dineInStepperReducer";
import takeAwayStepperReducer from "./takeAwayStepperReducer";

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
  form: stepperFormReducer,
  compOrder: compOrderReducer,
  dineInOrder: dineInOrderReducer,
  dineInForm: dineInStepperReducer,
  takeAwayForm: takeAwayStepperReducer,
});
