import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth/authSlice";
import usersReducer from "./features/user/userSlice";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { combineReducers, type Reducer } from "redux";

// Initial store is created WITHOUT persistence to remain SSR-safe. Persistence is
// initialized on the client by calling `initStorePersistence()` which dynamically
// imports the real storage implementation and replaces the reducers with persisted ones.

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
        users: usersReducer,
    },

    middleware: (getDefaultMiddlewares) =>
        getDefaultMiddlewares({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ['auth.session', 'auth.user', 'auth'],
                ignoredActionPaths: ['payload.session', 'payload.user', 'meta.arg'],
            },
        }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// Call this from a client-only location (for example, inside a useEffect in a "use client"
// component) to enable persistence. It will dynamically import the client storage and
// apply `persistReducer` to the desired slices, then create and return a Persistor.
export async function initStorePersistence() {
    if (typeof window === 'undefined') return null;

    // Load browser storage lazily so server bundles remain clean
    const storageModule = await import('redux-persist/lib/storage');
    const storage = storageModule.default;

    // Create persist config for auth
    const authPersistConfig = {
        key: 'auth',
        storage,
        whitelist: ['user', 'session'],
    };

    const usersPersistConfig = {
        key: 'users',
        storage,
        whitelist: ['user'],
    };

    const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
    const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);

    const rootReducer = combineReducers({
        [baseApi.reducerPath]: baseApi.reducer,
        auth: persistedAuthReducer,
        users: persistedUsersReducer,
    });

    // Replace the store reducer with the persisted version and create a persistor
    // replaceReducer has a slightly different inferred type due to `PersistPartial` being added;
    // cast through `unknown` to `Reducer` to avoid the lint error for `any`.
    store.replaceReducer(rootReducer as unknown as Reducer);
    const persistor = persistStore(store);
    return persistor;
}