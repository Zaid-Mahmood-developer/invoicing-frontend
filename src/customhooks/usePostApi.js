import axios from "axios";
import { useState } from "react";

export const usePostApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (payload = {}, headers = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        url,
        payload,
        {
          headers,
          withCredentials: true,
        }
      );

      setData(response?.data);
      return response?.data; 
    } 
    catch (err) {
      const message = err?.response?.data || "Something went wrong";
      setError(message);
      return { error: message }; 
    } 
    finally {
      setLoading(false);
    }
  };

  return { registerUser, data, loading, error };
};
