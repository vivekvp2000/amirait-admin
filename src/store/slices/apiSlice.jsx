const authHeaders = {
  headers: {
    Authorization: import.meta.env.VITE_API_TOKEN,
  },
};

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  tagTypes: ['invoice', 'proposal'],
  endpoints: (builder) => ({
    // Invoice endpoints
    addInvoice: builder.mutation({
      query: (formData) => ({
        url: "/payment/store/invoice",
        method: "POST",
        body: formData,
        ...authHeaders,
      }),
      invalidatesTags: ['invoice'],
    }),
    getInvoices: builder.query({
      query: () => ({
        url: "payment/view/all/invoicess",
        method: "GET",
        ...authHeaders,
      }),
      providesTags: ['invoice'],
    }),
    getInvoice: builder.query({
      query: (id) => ({
        url: `payment/view/invoice/${id}`,
        method: "GET",
        ...authHeaders,
      }),
    }),

    // Proposal endpoints
    addProposal: builder.mutation({
      query: (formData) => ({
        url: `/store/porposal`,
        method: "POST",
        body: formData,
        ...authHeaders,
      }),
      invalidatesTags: ['proposal'], // Invalidates 'proposal' cache
    }),
    getProposals: builder.query({
      query: () => ({
        url: "/all/propsal",
        method: "GET",
        ...authHeaders,
      }),
      providesTags: ['proposal'], // Provides 'proposal' cache
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useAddInvoiceMutation,
  useGetInvoiceQuery,
  useAddProposalMutation,
  useGetProposalsQuery
} = apiSlice;
