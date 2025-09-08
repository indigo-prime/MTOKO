"use client";

import PlaceCard2 from "@/components/PlaceCard2";

export interface Place {
    id: string;
    name: string;
    categories: string[];
    moods: string[];
    priceMin: number | null;
    priceMax: number | null;
    avatarSrc: string;
    imageSrc: string;
    likes: number;
    description: string;
    location: string; // Add location
}

interface PlacesResultsProps {
    places: Place[];
}

export default function PlacesResults({ places }: PlacesResultsProps) {
    return (
        <div className="grid grid-cols-1 justify-items-center gap-4 w-full">
            {places.length > 0 ? (
                places.map((place) => (
                    <PlaceCard2
                        key={place.id}
                        placeId={place.id}
                        username={place.name}
                        avatarSrc={place.avatarSrc}
                        imageSrc={place.imageSrc}
                        likes={place.likes}
                        location={place.location} // Pass location
                        categories={place.categories} // Pass as array
                        moods={place.moods} // Pass as array
                        priceMin={place.priceMin ?? 0}
                        priceMax={place.priceMax ?? 0}
                        description={place.description}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500">No places found.</p>
            )}
        </div>
    );
}