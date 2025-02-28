import { combineReducers } from "redux";
import  persistedReducer  from "./authSlice";
import persisteCartdReducer from "./cartSlice";

const rootReducer = combineReducers({
  auth: persistedReducer,
  shoppingCart: persisteCartdReducer,
});

export default rootReducer;