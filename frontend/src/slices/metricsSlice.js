// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import api from '../services/api';

// export const fetchMetrics = createAsyncThunk('metrics/fetchMetrics', async () => {
//   const response = await api.get('/metrics');
//   return response.data;
// });

// const metricsSlice = createSlice({
//   name: 'metrics',
//   initialState: {
//     data: [],
//     loading: false,
//     error: null,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMetrics.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchMetrics.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchMetrics.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default metricsSlice.reducer;
