/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useMemo, useEffect, useState } from "react";
// import Cookies from 'js-cookie';
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { store, initStorePersistence } from "@/redux/store";
// import { Toaster } from '@/components/ui/sonner';

// const Providers = ({ children }: { children: React.ReactNode }) => {
//     const [persistor, setPersistor] = useState<any | null>(null);

//     useEffect(() => {
//         // Initialize persistence on client only
//         let mounted = true;
//         initStorePersistence().then((p) => {
//             if (mounted && p) setPersistor(p);
//         });

//         // Debug: poll cookies for 30s to detect unexpected removal of auth cookies
//         let elapsed = 0;
//         const interval = setInterval(() => {
//             const token = Cookies.get('token');
//             const better = Cookies.get('better-auth.session_token');
//             console.debug('[Providers debug] token:', !!token, 'better-auth:', !!better, 'elapsed:', elapsed);
//             elapsed += 2;
//             if (elapsed > 30) clearInterval(interval);
//         }, 2000);

//         return () => { mounted = false; clearInterval(interval); };
//     }, []);

//     return (
//         <Provider store={store}>
//             {persistor ? (
//                 <PersistGate loading={null} persistor={persistor}>
//                     {children}
//                     <Toaster />
//                 </PersistGate>
//             ) : (
//                 <>
//                     {children}
//                     <Toaster />
//                 </>
//             )}
//         </Provider>
//     );
// };

// export default Providers;


"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, initStorePersistence } from "@/redux/store";
import { Toaster } from '@/components/ui/sonner';
import { authClient } from "@/lib/auth-client"; // Import your Better Auth client

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [persistor, setPersistor] = useState<any | null>(null);

    useEffect(() => {
        let mounted = true;

        // 1. Initialize Redux Persistence
        initStorePersistence().then((p) => {
            if (mounted && p) setPersistor(p);
        });

        // 2. Debug: Check Session via Client (Not Cookies)
        // We use authClient because we can't read httpOnly cookies directly
        const interval = setInterval(async () => {
            const session = await authClient.getSession();
            console.debug(
                '[Auth Debug] Better Auth Session:', !!session.data, 
                '| User:', session.data?.user?.email
            );
        }, 5000);

        return () => { 
            mounted = false; 
            clearInterval(interval); 
        };
    }, []);

    // 3. Prevent "Flash of Unauthenticated Content"
    // If we render {children} before persistor is ready, the Redux store is empty.
    // The app might redirect to login immediately. It's safer to wait.
    if (!persistor) {
        return (
            <div className="flex h-screen items-center justify-center">
                {/* Optional: Add a spinner here */}
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