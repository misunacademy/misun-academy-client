/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, initStorePersistence } from "@/redux/store";
import { Toaster } from '@/components/ui/sonner';


const Providers = ({ children }: { children: React.ReactNode }) => {
    const [persistor, setPersistor] = useState<any | null>(null);

    useEffect(() => {
        let mounted = true;

        initStorePersistence().then((p) => {
            if (mounted && p) setPersistor(p);
        });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <Provider store={store}>
            {persistor ? (
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            ) : (
                children
            )}
            <Toaster />
        </Provider>
    );
};

export default Providers;

