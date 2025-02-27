import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";


const cartSlice = createSlice({
    name: 'shoppingCart',
    initialState: {
        cart: null,
        items: [{}],
        totalAmout: 0,
    },
    reducers: {
        setCartRedux: (state, action) => {
            state.cart = action.payload.cart;
        },
        setCartItemsRedux: (state, action) => {
            state.items = action.payload.items;
            state.totalAmout = action.payload.items.reduce((total, item) => total + item.price * item.quantity, 0);
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
            state.items = state.items.filter((item) => item.productId !== action.payload);
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
            state.items = state.items.map((item) => {
                if (item.itemId === action.payload.itemId) {
                    item.quantity--;
                    state.totalAmout = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
                }
                if (item.quantity === 0) {
                    state.items = state.items.filter((item) => item.itemId !== action.payload.itemId);
                }
                return item;
            });
        },
        clearCart: (state) => {
            state.cart = null;
            state.items = [];
        },
    },
});

const { setCartRedux,
    setCartItemsRedux,
    addItemToCart,
    removeItemFromCart,
    increaseQuantityItem,
    decrementQuantityItem,
    clearCart
} = cartSlice.actions;

const persistConfig = {
    key: "shoppingCart",
    whitelist: ["cart", "items"],
    storage,
};

const persisteCartdReducer = persistReducer(persistConfig, cartSlice.reducer);

export {
    setCartRedux, setCartItemsRedux, addItemToCart, removeItemFromCart,
    increaseQuantityItem, decrementQuantityItem, clearCart
};
export default persisteCartdReducer;