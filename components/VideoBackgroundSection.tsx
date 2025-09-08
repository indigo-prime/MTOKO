"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const videos = [
    { src: "/videos/chocolate.mp4", leftText: "Feel the taste", rightText: "of fine chocolate." },
    { src: "/videos/b2.mp4", leftText: "Explore different", rightText: "Cuisines in Town." },
    { src: "/videos/b4.mp4", leftText: "Relax and enjoy", rightText: "The perfect view." },
    { src: "/videos/b3.mp4", leftText: "Enjoy Time lasting", rightText: "Experiences." },
];

export default function VideoBackgroundSection() {
    const [current, setCurrent] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % videos.length);
                setFade(true);
            }, 800); // fade duration
        }, 8000); // time per video
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="video-background-section relative h-screen w-full overflow-hidden">
            {/* Video */}
            <div className="background-video-container fixed top-0 left-0 w-full h-screen z-[-1]">
                <video
                    key={current} // important to reload video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-800 ${fade ? "opacity-100" : "opacity-0"}`}
                >
                    <source src={videos[current].src} type="video/mp4" />
                </video>
            </div>

            {/* Text */}
            <div className="container flex flex-col justify-center h-full relative z-10 px-4">
                <div className="text-container relative w-full flex justify-between items-center">
                    <h2
                        className={`text-2xl sm:text-3xl lg:text-5xl lg:ml-65 font-bold text-mtoko-light transform transition-all duration-1000 ${
                            fade ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                        }`}
                    >
                        {videos[current].leftText}
                    </h2>
                    <h2
                        className={`text-2xl sm:text-3xl lg:text-5xl font-bold text-mtoko-light transform transition-all duration-1000 ${
                            fade ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
                        }`}
                    >
                        {videos[current].rightText}
                    </h2>
                </div>

                {/* Images */}

            </div>
        </section>
    );
}
