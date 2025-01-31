import { combineReducers } from "redux";
import  persistedReducer  from "./authSlice";

const rootReducer = combineReducers({
  auth: persistedReducer,
});

export default rootReducer;