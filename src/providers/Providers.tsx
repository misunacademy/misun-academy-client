"use client";

import { Provider } from "react-redux";
import { MotionConfig } from "framer-motion";
import { store } from "@/redux/store";
import { Toaster } from '@/components/ui/sonner';
import SocketProvider from "./SocketProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <MotionConfig reducedMotion="user">
                <SocketProvider>
                    {children}
                </SocketProvider>
            </MotionConfig>
            <Toaster />
        </Provider>
    );
};

export default Providers;
