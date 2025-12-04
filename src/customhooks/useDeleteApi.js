import axios from "axios";
import { useState } from "react"

export const useDeleteApi = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteUser = async (url) => {
        try {
            setLoading(true);
            setData(null);
            setError(null);
            const response = await axios.delete(url, { withCredentials : true });
            setData(response.data)
        }
        catch (error) {
            console.log(error , "delErr")
            setData(null);
            setError(error.response?.data || { message: "Something went wrong" });
        }
        finally {
            setLoading(false);
        }
    }
    return { deleteUser, data, loading, error };
}