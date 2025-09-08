// app/components/PlaceCardGoogle.tsx
"use client";

import Image from "next/image";

interface PlaceCardProps {
    place: {
        id: string;
        name: string;
        image: string;
        address: string;
        rating: number | null;
        mood: string;
        category: string;
        priceRange: { min: number; max: number };
    };
}

export default function PlaceCardGoogle({ place }: PlaceCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-start gap-2 w-full">
            <Image
                src={place.image}
                alt={place.name}
                width={400}
                height={200}
                className="rounded-xl object-cover w-full h-48"
            />
            <h3 className="text-lg font-bold">{place.name}</h3>
            <p className="text-sm text-gray-600">{place.address}</p>
            <div className="flex justify-between items-center w-full text-sm mt-1">
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-xl">
          {place.category}
        </span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-xl">
          {place.mood}
        </span>
            </div>
            <div className="flex justify-between items-center w-full mt-1 text-sm text-gray-700">
                {place.rating && <span>⭐ {place.rating}</span>}
                <span>
          💵 {place.priceRange.min} - {place.priceRange.max}
        </span>
            </div>
        </div>
    );
}
