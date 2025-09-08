"use client"; // must be a client component

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Google } from "@/components/ui/google";

const GoogleSignIn = () => {
    return (
        <Button
            className="w-full"
            variant="outline"
            onClick={() => signIn("google")}
        >
            <Google />
            Continue with Google
        </Button>
    );
};

export { GoogleSignIn };
