// // src/slices/authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Async thunk for login
// export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
//     try {
//         const response = await axios.post('/api/login', credentials); // Update with your login endpoint
//         return response.data;
//     } catch (error) {
//         return rejectWithValue(error.response.data);
//     }
// });

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         user: null,
//         token: null,
//         loading: false,
//         error: null,
//     },
//     reducers: {
//         logout: (state) => {
//             state.user = null;
//             state.token = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(login.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
