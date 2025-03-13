import { combineReducers } from "redux";
import  persistedReducer  from "./authSlice";
import persistedCartReducer from "./cartSlice";
import productReducer from "./productSlice"; // Import productSlice

const rootReducer = combineReducers({
  auth: persistedReducer,
  shoppingCart: persistedCartReducer,
  product: productReducer,
});

export default rootReducer;