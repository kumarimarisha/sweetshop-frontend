import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sweetsReducer from './slices/sweetsSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    sweets: sweetsReducer,
    cart: cartReducer,
  },
});

export default store;
