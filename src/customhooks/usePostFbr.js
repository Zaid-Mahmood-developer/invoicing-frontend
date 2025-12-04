import axios from "axios";
import { useState } from "react";

export const usePostFbr = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const registerUser = async (payload = {}, headers = {}) => {
    try {
      setLoading(true);
      setData(null);
      setError(null);
      const response = await axios.post(url, payload, { headers });
        
      setData(response?.data);
    } catch (err) {
      setData(null);
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  return { registerUser, data, loading, error };
};