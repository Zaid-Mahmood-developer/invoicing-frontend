import { useState, useEffect } from "react";
import axios from "axios";
export const useGetApi = (url = null, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchData = async (overrideUrl) => {
    const finalUrl = overrideUrl || url;
    if (!finalUrl) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(finalUrl, { withCredentials: true });
      setData(response.data);
    } catch (err) {
     
      setError(err.response?.data || { message: "Something went wrong" });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && url) {
      fetchData();
    }
  }, [url, autoFetch]);

  return { data, loading, error, fetchData };
};
