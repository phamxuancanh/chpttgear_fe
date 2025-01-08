// src/redux/rootReducer.js
import { combineReducers } from "redux";
import userSlice from "./userSlice";

const rootReducer = combineReducers({
  user: userSlice, // Make sure to use "user" as the key for clarity
});

export default rootReducer;
