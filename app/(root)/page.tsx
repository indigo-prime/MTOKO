import VideoBackgroundSection from "@/components/VideoBackgroundSection";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import React from "react";
import HomeSlider from "@/components/HomeSlider";


const Home= async ()=> {
    const session = await auth();
    if (!session) redirect("/sign-in");
    return (
        <>
            <VideoBackgroundSection />
            <HomeSlider/>
        </>
    );
}

export default Home;