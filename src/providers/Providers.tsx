"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from '@/components/ui/sonner';
import SocketProvider from "./SocketProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <SocketProvider>
                {children}
            </SocketProvider>
            <Toaster />
        </Provider>
    );
};

export default Providers;
