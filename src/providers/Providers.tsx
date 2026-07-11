/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, initStorePersistence } from "@/redux/store";
import { Toaster } from '@/components/ui/sonner';
import SocketProvider from './SocketProvider';


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
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </PersistGate>
            ) : (
                <SocketProvider>
                    {children}
                </SocketProvider>
            )}
            <Toaster />
        </Provider>
    );
};

export default Providers;
