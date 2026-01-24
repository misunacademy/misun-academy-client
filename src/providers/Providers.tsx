/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, initStorePersistence } from "@/redux/store";
import { Toaster } from '@/components/ui/sonner';
import { authClient } from "@/lib/auth-client";


const Providers = ({ children }: { children: React.ReactNode }) => {
    const [persistor, setPersistor] = useState<any | null>(null);

    useEffect(() => {
        let mounted = true;

        initStorePersistence().then((p) => {
            if (mounted && p) setPersistor(p);
        });

        const checkSession = async () => {
            try {
                const session = await authClient.getSession();
                const user = store.getState().auth.user;

                if (session.data || user) {
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('[Auth Debug] Error fetching session:', error);
            }
        };
        const intervalId = setInterval(checkSession, 30000); // Increased to 30 seconds to prevent rate limiting

        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, []);

    if (!persistor) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-muted-foreground">Loading application...</div>
            </div>
        );
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
                <Toaster />
            </PersistGate>
        </Provider>
    );
};

export default Providers;

