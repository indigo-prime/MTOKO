"use client";

import { useEffect, useState } from "react";
import PlaceCard2 from "@/components/PlaceCard2";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface SavedPlace {
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

export default function SavedPlacesPage() {
    const [places, setPlaces] = useState<SavedPlace[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== "authenticated") return;

        const fetchSaved = async () => {
            try {
                const res = await fetch("/api/user/saved");
                if (!res.ok) throw new Error("Failed to fetch saved places");
                const data = await res.json();
                setPlaces(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSaved();
    }, [status]);

    const removePlaceFromUI = (placeId: string) => {
        setPlaces((prev) => prev.filter((place) => place.id !== placeId));
    };

    if (loading) {
        return <div className="p-6 text-center">Loading saved places...</div>;
    }

    if (!session?.user) {
        return <div className="p-6 text-center">Please log in to view saved places.</div>;
    }

    if (places.length === 0) {
        return (
            <>
                <div className="max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6 mt-15 max-w-[935px]">
                <h1 className="text-2xl font-bold text-gray-800">My Saved Places</h1>
                <div className="flex items-center gap-3">
                    <Image
                        src={session?.user?.image || "/images/avatars/default.png"}
                        alt="user"
                        width={40}
                        height={40}
                        className="rounded-full border"
                    />
                    <p className="text-gray-700 font-medium">{session?.user?.name || "Guest"}</p>

                </div>
            </div>
            <div className="p-6 text-center text-mtoko-light">You have no saved places yet.</div>
                </div>
                </>
    );
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6 mt-15 max-w-[935px]">
                <h1 className="text-2xl font-bold text-gray-800">My Saved Places</h1>
                <div className="flex items-center gap-3">
                    <Image
                        src={session?.user?.image || "/images/avatars/default.png"}
                        alt="user"
                        width={40}
                        height={40}
                        className="rounded-full border"
                    />
                    <p className="text-gray-700 font-medium">{session?.user?.name || "Guest"}</p>

                </div>
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

                        // 🔥 Pass removal callback
                        onUnsave={() => removePlaceFromUI(place.id)}
                    />
                ))}
            </div>
        </div>
    );
}
