import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const addInvoice = async (data) => {
  try {
    const response = await api.post("/payment/store/invoice", data, {
      headers: {
        Authorization: `${import.meta.env.VITE_API_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};