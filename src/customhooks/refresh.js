import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

// separate instance ONLY for refresh
export const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});
