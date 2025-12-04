import { configureStore } from "@reduxjs/toolkit";
import submitReducer from "./Slices/LoginValuesSlice";
export const store = configureStore({
  reducer: {
    submitStore: submitReducer
  },
});