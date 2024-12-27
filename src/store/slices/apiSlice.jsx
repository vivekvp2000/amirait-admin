import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  tagTypes: ['invoice'],
  endpoints: (builder) => ({
    addInvoice: builder.mutation({
      query: (formData) => ({
        url: "/payment/store/invoice",
        method: "POST",
        body: formData,
        headers: {
          Authorization: import.meta.env.VITE_API_TOKEN,
        },
      }),
      invalidatesTags: ['invoice']
    }),
    getInvoices: builder.query({
      query: () => ({
        url: "payment/view/all/invoicess",
        method: "GET",
        headers: {
          Authorization: import.meta.env.VITE_API_TOKEN,
        },
        params: {}
      }),
      providesTags: ['invoice']
    }),
    getInvoice: builder.query({
      query: (id) => ({
        url: `payment/view/invoice/${id}`,
        method: "GET",
        headers: {
          Authorization: import.meta.env.VITE_API_TOKEN,
        }
      })
    })
  }),
});
export const { useGetInvoicesQuery, useAddInvoiceMutation, useGetInvoiceQuery } = apiSlice;
