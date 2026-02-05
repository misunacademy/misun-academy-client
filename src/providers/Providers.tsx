/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, initStorePersistence } from "@/redux/store";
import { Toaster } from '@/components/ui/sonner';
import { authClient } from "@/lib/auth-client";
import { usePathname } from 'next/navigation';
import { initPixel, trackPageView } from '@/lib/metaPixel';


const Providers = ({ children }: { children: React.ReactNode }) => {
    const [persistor, setPersistor] = useState<any | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Initialize Meta Pixel using public client-side env var
        initPixel(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
    }, []);

    useEffect(() => {
        // Track a PageView on route change
        trackPageView();
    }, [pathname]);

    useEffect(() => {
        let mounted = true;

        initStorePersistence().then((p) => {
            if (mounted && p) setPersistor(p);
        });

        // Note: Session polling removed - Better Auth handles session updates automatically
        // via useSession hook and cookie cache. No need for manual polling.

        return () => {
            mounted = false;
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

