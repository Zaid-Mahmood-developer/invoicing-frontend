import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loginVal: false,
    loading: true,
    signupVal: null // for initial session check
};

export const LoginValuesSlice = createSlice({
    name: "submitStore",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loginVal = !!action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.loginVal = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        signupVals: (state, action) => {
            state.signupVal = action.payload;
        }
    }
})

export const { setUser, logout, setLoading, signupVals } = LoginValuesSlice.actions;

export default LoginValuesSlice.reducer;
