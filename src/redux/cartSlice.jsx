import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const cartSlice = createSlice({
  name: 'shoppingCart',
  initialState: {
    cart: null,
    items: [],
    selectItems: [],
    totalAmout: 0,
  },
  reducers: {
    setCartRedux: (state, action) => {
      console.log("1 cart redux", action.payload.cart);
      state.cart = action.payload.cart;
    },
    setCartItemsRedux: (state, action) => {
      state.items = action.payload.items;
      state.totalAmout = action.payload.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    setSelectedItemsRedux: (state, action) => {
      state.selectItems = action.payload.selectItems;
      console.log("1 selectItems redux", state.selectItems);
    },
    addItemToCart: (state, action) => {
      const item = state.items.find((item) => item.productId === action.payload.productId);
      if (item) {
        item.quantity = 1;
        state.totalAmout = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      } else {
        state.items.push(action.payload);
        state.totalAmout = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      };
    },
    removeItemFromCart: (state, action) => {
      console.log(action.payload)
      state.items = state.items.filter((item) => item.itemId !== action.payload.itemId);
      state.totalAmout = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    increaseQuantityItem: (state, action) => {
      state.items = state.items.map((item) => {
        if (item.itemId === action.payload.itemId) {
          item.quantity++;
          state.totalAmout = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
        }
        return item;
      });
    },
    decrementQuantityItem: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.itemId === action.payload.itemId);

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity--;

        // Nếu số lượng về 0, xóa luôn khỏi giỏ hàng
        if (state.items[itemIndex].quantity === 0) {
          state.items = state.items.filter(item => item.itemId !== action.payload.itemId);
        }
      }

      // Cập nhật tổng tiền
      state.totalAmout = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    clearCart: (state) => {
      state.cart = null;
      state.items = [];
      state.selectItems = [];
    },
  },
});

const { setCartRedux,
  setCartItemsRedux,
  setSelectedItemsRedux,
  addItemToCart,
  removeItemFromCart,
  increaseQuantityItem,
  decrementQuantityItem,
  clearCart
} = cartSlice.actions;

const persistConfig = {
  key: "shoppingCart",
  whitelist: ["cart", "items", "selectItems", "totalAmout"],
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartSlice.reducer);

export {
  setCartRedux, setCartItemsRedux, setSelectedItemsRedux, addItemToCart, removeItemFromCart,
  increaseQuantityItem, decrementQuantityItem, clearCart
};
export default persistedCartReducer;