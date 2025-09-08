"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {IoLogOutOutline} from "react-icons/io5";
import Link from "next/link";
import {redirect} from "next/navigation";

const SignOut = () => {
    const handleSignOut = async () => {
        await signOut();
        redirect("/");

    };

    return (
        <>


    <Button onClick={handleSignOut}

        className="flex items-center gap-[10px] px-[12px] py-[8px] text-mtoko-light text-[14px] font-normal rounded-[4px] hover:bg-mtoko-dark/50 hover:scale-105 transition-transform"
    >
        <IoLogOutOutline className="text-[16px]" />
        <span>Logout</span>
    </Button>
        </>
    );
};

export { SignOut };
