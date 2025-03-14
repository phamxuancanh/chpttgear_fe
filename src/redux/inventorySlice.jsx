import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        inventories: [],
        productsInInventory: [],
        stockIns: [],
        stockOuts: [],
        selectedInventory: null
    },
    reducers: {
        setAllInventory: (state, action) => {
            state.inventories = action.payload;
        },
        setAllProductsInInventory: (state, action) => {
            state.productsInInventory = action.payload;

        },
        setStockInsInInventory: (state, action) => {
            state.stockIns = action.payload;
        },
        setStockOutsInInventory: (state, action) => {
            state.stockOuts = action.payload;
        },

        // ✅ Thêm danh sách sản phẩm vào `productsInInventory`
        addProductsToInventory: (state, action) => {
            console.log(action.payload.products)
            state.productsInInventory = [...state.productsInInventory, ...action.payload.products];
        },
        addInventory: (state, action) => {
            console.log(action.payload)
            state.inventories = [...state.inventories, action.payload.inventory];
        },

        // ✅ Cập nhật thông tin stockIn
        updateStockIn: (state, action) => {
            console.log(action.payload);
            state.stockIns.push(action.payload);

        },
        updateQuantityByInventory: (state, action) => {
            console.log(action.payload)
            const { inventory_id, quantity } = action.payload;

            // Tìm inventory theo inventory_id
            const inventoryIndex = state.inventories.findIndex(inv => inv.inventory_id === inventory_id);
            console.log(inventoryIndex)
            if (inventoryIndex !== -1) {
                // Cộng dồn số lượng vào inventory tương ứng
                state.inventories[inventoryIndex].quantity_in_stock += quantity;
            }
        },
        setSelectedInventory: (state, action) => {
            console.log(action.payload);
            state.selectedInventory = action.payload;

        },
        upadteSelectedInventoryQuantity: (state, action) => {
            console.log(action.payload)
            const quantity = action.payload;
            state.selectedInventory.quantity_in_stock += quantity;
        },
    },
});

const {
    setAllInventory,
    setAllProductsInInventory,
    setStockOutsInInventory,
    setStockInsInInventory,
    addProductsToInventory,
    updateStockIn,
    addInventory,
    updateQuantityByInventory,
    setSelectedInventory,
    upadteSelectedInventoryQuantity
} = inventorySlice.actions;

const persistConfig = {
    key: "inventory",
    whitelist: ["stockIns", "stockOuts"],
    storage,
};

const persistedInventoryReducer = persistReducer(persistConfig, inventorySlice.reducer);

export {
    setAllInventory,
    setAllProductsInInventory,
    setStockOutsInInventory,
    setStockInsInInventory,
    addProductsToInventory,
    updateStockIn,
    addInventory,
    updateQuantityByInventory,
    setSelectedInventory,
    upadteSelectedInventoryQuantity
};

export default persistedInventoryReducer;
