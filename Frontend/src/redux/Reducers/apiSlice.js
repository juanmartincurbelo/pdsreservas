import { createApi } from '@reduxjs/toolkit/query/react';


export const api = createApi({
  endpoints: () => ({
    
  }),
  reducerPath: 'api',
  tagTypes: [],
});

export const { useGetQuery } = api;
