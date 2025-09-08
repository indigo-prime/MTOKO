"use client";

import { useEffect, useState } from "react";
import PlaceCard2 from "@/components/PlaceCard2";

interface Place {
    id: string;
    name: string;
    description: string;
    location: string;
    imageSrc: string;
    priceMin: number;
    priceMax: number;
    categories: string[];
    moods: string[];
    likes: number;
}

export default function MostLikedPlacesPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMostLiked = async () => {
        try {
            const res = await fetch("/api/trending/most-liked");
            if (!res.ok) throw new Error("Failed to fetch places");
            const data = await res.json();
            setPlaces(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMostLiked();

        // Poll every 5 seconds
        const interval = setInterval(fetchMostLiked, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="p-6 text-center">Loading places...</div>;
    }

    if (places.length === 0) {
        return <div className="p-6 text-center">No places found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 mt-15">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6 max-w-[935px]">
                <h1 className="text-2xl font-bold text-gray-800">Most Liked Places</h1>
            </div>

            <div className="flex flex-col gap-6">
                {places.map((place) => (
                    <PlaceCard2
                        key={place.id}
                        placeId={place.id}
                        name={place.name}
                        description={place.description}
                        location={place.location}
                        imageSrc={place.imageSrc}
                        priceMin={place.priceMin}
                        priceMax={place.priceMax}
                        categories={place.categories}
                        moods={place.moods}
                        likes={place.likes}

                        username={place.name}
                        avatarSrc={place.imageSrc || "/images/avatars/default.png"}
                    />
                ))}
            </div>
        </div>
    );
}
