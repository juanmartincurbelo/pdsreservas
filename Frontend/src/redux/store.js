/* eslint-disable unicorn/prefer-spread */
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@redux/Reducers/apiSlice';

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  reducer: {
    [api.reducerPath]: api.reducer,
  },
});

export default store;
