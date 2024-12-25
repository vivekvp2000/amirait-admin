
import { apiSlice } from "../apiSlice";

apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // For Login 
        loginUser: builder.mutation({
            query: (formData) => ({
                url: "login",
                method: "POST",
                body: formData,
            })
        })
    }),
    overrideExisting: false,
})
export const { useLoginUserMutation } = apiSlice;