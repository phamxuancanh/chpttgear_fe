import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Lưu trữ trong localStorage

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    selectedProduct: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    }
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  selectProduct
} = productSlice.actions;

// Cấu hình persist
const persistConfig = {
  key: "product",
  storage,
};

export default persistReducer(persistConfig, productSlice.reducer);
