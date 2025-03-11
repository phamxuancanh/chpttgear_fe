import { combineReducers } from "redux";
import  persistedReducer  from "./authSlice";
import persistedCartReducer from "./cartSlice";

const rootReducer = combineReducers({
  auth: persistedReducer,
  shoppingCart: persistedCartReducer,
});

export default rootReducer;