"use client";

import Image from "next/image";
import styles from "./HomeSlider.module.css";
import { useEffect, useState } from "react";

type SubCategory = {
    id: string;
    name: string;
    imageUrl: string | null;
    mainCategory: {
        name: string;
    };
};

export default function HomeSlider() {
    const [rowImages, setRowImages] = useState<string[][]>([[], [], []]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/home-slider");
                if (!res.ok) throw new Error("Failed to fetch home slider data");
                const data = await res.json();

                // Ensure safe arrays
                setRowImages([
                    Array.isArray(data.foodPack) ? data.foodPack : [],
                    Array.isArray(data.familyAndKids) ? data.familyAndKids : [],
                    Array.isArray(data.nightLife) ? data.nightLife : [],
                ]);
            } catch (error) {
                console.error("Error fetching slider images:", error);
                setRowImages([[], [], []]); // fallback
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <section className={`home-slidery ${styles.homeSlidery} bg-mtoko-dark py-8 h-full`}>
                <div className="text-center text-white">Loading slider...</div>
            </section>
        );
    }

    return (
        <section className={`home-slidery ${styles.homeSlidery} bg-mtoko-dark py-8 h-full`}>
            <div className="container-home-slider max-w-[90vw] lg:max-w-[1200px] mx-auto">
                {rowImages.map((images = [], rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`${styles.sliderHome} w-full h-[300px] md:h-[400px] overflow-hidden my-4`}
                        style={
                            {
                                "--quantity": images.length,
                                "--height": "300px",
                                "--width": "395px",
                            } as React.CSSProperties
                        }
                    >
                        <div
                            className={`${styles.list} flex w-full ${
                                rowIndex === 1 ? styles.reverse : ""
                            }`}
                            style={{ minWidth: `calc(300px * ${images.length || 1})` }}
                        >
                            {images.length > 0 ? (
                                images.map((src, index) => (
                                    <div
                                        key={`${rowIndex}-${index}`}
                                        className={`${styles.item} absolute`}
                                        style={{ "--position": index + 1 } as React.CSSProperties}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Slide ${rowIndex + 1}-${index + 1}`}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                            priority={index === 0}
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No images available
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
