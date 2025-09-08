import type {Metadata} from "next";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {config} from "@fortawesome/fontawesome-svg-core";
import {auth} from "@/lib/auth";

config.autoAddCss = false;

import React from "react";
import {Toaster} from "react-hot-toast";

export const metadata: Metadata = {
    title: "mtoko",
    description: "Find a place to make memories",
    icons: {
        icon: "/mtoko.png",           // favicon
        shortcut: "/mtoko.png",       // optional, for older browsers
        apple: "/mtoko.png",          // optional, for iOS devices
    },

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="font-poppins bg-mtoko-dark">

        {children}
        <Toaster
            position="top-right"
            toastOptions={{
                className: "rounded-lg shadow-md mt-50",
                success: {
                    className: "bg-green-600 text-white px-4 py-2",
                },
                error: {
                    className: "bg-red-600 text-white px-4 py-2",
                },
            }}
        />

        </body>
        </html>
    );
}
