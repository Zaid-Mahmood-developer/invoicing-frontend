import { useState } from "react";
import axios from "axios";

export const usePutApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (payload = {}) => {
    try {
      setLoading(true);
        setData(null);
      setError(null);
      const response = await axios.put(url, payload, { withCredentials : true });
      setData(response.data);
    } catch (err) {
      setData(null);
      setError(err.response?.data || { message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };
  return { updateData, data, loading, error };
};
