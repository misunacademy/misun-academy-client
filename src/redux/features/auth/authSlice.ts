import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
    user: object | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
            state.error = null;
            Cookies.remove('token');
        },
    },
});

export const { setUser, setError, logout } = authSlice.actions;

export default authSlice.reducer;