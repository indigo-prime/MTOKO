"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PlaceCard2 from "@/components/PlaceCard2";

const PlacesMap = dynamic(() => import("@/components/maps/PlacesMap"), { ssr: false });

// Type for each place
interface Place {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  priceMin: number;
  priceMax: number;
  imageUrls: string[];
  distance?: number;
}

// Type-safe props for PlaceCard2
interface PlaceCardProps {
  placeId: string;
  name: string;
  description: string;
  location: string;
  imageSrc: string;
  priceMin: number;
  priceMax: number;
  categories: string[];
  moods: string[];
  likes: number;
  avatarSrc: string;
  username: string;
  distance?: number; // optional
}

export default function ClosestPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/closest");
        if (!res.ok) throw new Error("Failed to fetch places");
        const data: Place[] = await res.json();

        const placesWithDistance = data.map((place) => ({
          ...place,
          distance: getDistanceFromLatLonInKm(
            userLocation.lat,
            userLocation.lng,
            place.latitude,
            place.longitude
          ),
        }));

        placesWithDistance.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

        setPlaces(placesWithDistance);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [userLocation]);

  if (loading) return <div className="p-6 text-center">Loading places...</div>;
  if (!userLocation) return <div className="p-6 text-center">Location not available</div>;
  if (places.length === 0) return <div className="p-6 text-center">No places found</div>;

  return (
    <div className="max-w-[936px] w-full mx-auto p-4 mt-[80px]">
      <div className="relative z-0 mb-6 h-[400px]">
        <PlacesMap places={places} userLocation={userLocation} />
      </div>

      <div className="flex flex-col gap-6">
        {places.map((place) => (
          <PlaceCard2
            key={place.id}
            placeId={place.id}
            name={place.name}
            description={place.description}
            location={place.location}
            imageSrc={place.imageUrls?.[0] ?? "/default-image.jpg"}
            priceMin={place.priceMin}
            priceMax={place.priceMax}
            categories={[]}
            moods={[]}
            likes={0}
            avatarSrc="/default-avatar.png"
            username={place.name}
            distance={place.distance} // now supported in PlaceCard2
          />
        ))}
      </div>
    </div>
  );
}

// Helper to calculate distance between coordinates
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
