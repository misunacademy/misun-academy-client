/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface AuthState {
    user: any | null;
    session: any | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    session: null,
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
            console.debug('[authSlice] setUser', action.payload);
        },
        setSession: (state, action) => {
            state.session = action.payload;
            state.user = action.payload?.user || null;
            state.isLoading = false;
            console.debug('[authSlice] setSession', action.payload);
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            console.debug('[authSlice] setError', action.payload);
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
            console.debug('[authSlice] setLoading', action.payload);
        },
        logout: (state) => {
            console.warn('[authSlice] logout triggered');
            state.user = null;
            state.session = null;
            state.isLoading = false;
            state.error = null;
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            Cookies.remove('better-auth.session_token');
            Cookies.remove('better-auth.callback-url');
        },
    },
});

export const { setUser, setSession, setError, setLoading, logout } = authSlice.actions;

export default authSlice.reducer;