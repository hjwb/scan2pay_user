import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import modelSlice from "./slices/modelSlice";
import priceSlice from "./slices/priceSlice";
import constSlice from "./slices/constSlice";
import pwaReducer from "./slices/pwaSlice";

const rootReducer = combineReducers({
  user: userReducer,
  model: modelSlice,
  price: priceSlice,
  consts: constSlice,
  pwa: pwaReducer,
});

export default rootReducer;
