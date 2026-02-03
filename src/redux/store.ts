import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
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

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        users: usersReducer,
    },

    middleware: (getDefaultMiddlewares) =>
        getDefaultMiddlewares({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta.request', 'meta.baseQueryMeta.response'],
            },
        }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export async function initStorePersistence() {
    if (typeof window === 'undefined') return null;

    // Load browser storage lazily so server bundles remain clean
    const storageModule = await import('redux-persist/lib/storage');
    const storage = storageModule.default;

    // Create persist config for users
    const usersPersistConfig = {
        key: 'users',
        storage,
        whitelist: ['user'],
    };

    const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);

    const rootReducer = combineReducers({
        [baseApi.reducerPath]: baseApi.reducer,
        users: persistedUsersReducer,
    });
    store.replaceReducer(rootReducer as unknown as Reducer);
    const persistor = persistStore(store);
    return persistor;
}
