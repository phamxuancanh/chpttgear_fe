import { createSlice } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authSlice = createSlice({
    name: 'auth',
    initialState: { isLoggedIn: false, user: null, token: null },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
        },
        setToken:(state, action) =>{
          state.token = action.payload;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload }; // Cập nhật thông tin user
        },
    },
});

const { login, logout, setToken, updateUser } = authSlice.actions;

const persistConfig = {
    key: 'auth',
    whitelist: ['isLoggedIn', 'user', 'token'],
    storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

export default persistedReducer;
export { login, logout, setToken, updateUser };