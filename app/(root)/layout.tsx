
import "@/styles/globals.css";
import Header from '@/components/Header';
import "@fortawesome/fontawesome-svg-core/styles.css";
import {config} from "@fortawesome/fontawesome-svg-core";
import {auth} from "@/lib/auth";

config.autoAddCss = false;
import {SessionProvider} from "next-auth/react";
import React from "react";

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    const session = await auth();
    return (
       <>
        <SessionProvider session={session}>
            <Header />

                {children}

        </SessionProvider>
       </>
    );
}