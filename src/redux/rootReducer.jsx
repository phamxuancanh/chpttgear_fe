// src/redux/rootReducer.js
import { combineReducers } from "redux";
import authSlice from "./authSlice";

const rootReducer = combineReducers({
  auth: authSlice,
});

export default rootReducer;
