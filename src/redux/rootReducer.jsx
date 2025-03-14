import { combineReducers } from "redux";
import persistedReducer from "./authSlice";
import persistedCartReducer from "./cartSlice";
import productReducer from "./productSlice"; // Import productSlice
import inventoryReducer from "./inventorySlice";

const rootReducer = combineReducers({
  auth: persistedReducer,
  shoppingCart: persistedCartReducer,
  product: productReducer,
  inventory: inventoryReducer
});

export default rootReducer;