import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  endpoints: (builder) => ({
    addInvoice: builder.mutation({
      query: (formData) => ({
        url: "/payment/store/invdoice",
        method: "POST",
        body: formData,
        headers: {
          Authorization: import.meta.env.VITE_API_TOKEN,
        },
      }),
    }),
  }),
});
export const { useAddInvoiceMutation } = apiSlice;
