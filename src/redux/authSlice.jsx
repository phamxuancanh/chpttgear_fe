import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { findUserById } from '';
// import jwtDecode from 'jwt-decode';
const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

// export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
//   const currentUser = localStorage.getItem('persist:auth');
//   if (!currentUser) {
//     throw new Error('No access token found');
//   }

//   let userId;
//   try {
//     const currentUserObj = JSON.parse(currentUser);
//     const decodedToken = jwtDecode(currentUserObj.accessToken);
//     console.log(decodedToken, 'decodedToken');
//     userId = decodedToken.userId;
//     console.log(userId, 'userId');
//   } catch (error) {
//     throw new Error('Invalid token'); 
//   }

//   const response = await findUserById(userId);

//   const updatedAuthData = {
//     ...JSON.parse(currentUser),
//     currentUser: response.data,
//   };
//   localStorage.setItem('persist:auth', JSON.stringify(updatedAuthData));

//   return response.data;
// });

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginState(state, action) {
      console.log('loginSuccess', action.payload);
      state.user = action.payload;
    },
    updateStateInfo(state, action) {
      const persistAuth = localStorage.getItem('persist:auth');
      if (persistAuth) {
        const authData = JSON.parse(persistAuth);
        authData.currentUser = action.payload;
        localStorage.setItem('persist:auth', JSON.stringify(authData));
      }
      state.user = action.payload;
    },
    logoutState(state) {
      state.user = null;
      localStorage.removeItem('persist:auth');
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchUser.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(fetchUser.fulfilled, (state, action) => {
  //       state.status = 'succeeded';
  //       state.user = action.payload;
  //     })
  //     .addCase(fetchUser.rejected, (state, action) => {
  //       state.status = 'failed';
  //       state.error = action.error.message || 'Failed to fetch user';
  //     });
  // },
});

export const { loginState, updateStateInfo, logoutState } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export default authSlice.reducer;
