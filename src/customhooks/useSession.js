import { refreshClient } from "./refresh";
import { api } from "./api";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser, setLoading } from "../redux/Slices/LoginValuesSlice";

export const useSession = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await refreshClient.get("/refresh");

        api.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.accessToken}`;

        dispatch(setUser(res.data.user));
      } catch (err) {
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkSession();
  }, []);
};
