import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import metricsReducer from '../slices/metricsSlice';
import programControlReducer from '../slices/programControlSlice';
import sessionReducer from '../slices/sessionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    metrics: metricsReducer,
    sessions: sessionReducer,
    programControl: programControlReducer,
  },
});

export default store;
