import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import invoicesReducer from './slices/invoicesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    invoices: invoicesReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
