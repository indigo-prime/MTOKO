"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../maps/fixLeafletIcons";

interface Place {
    id: string;
    name: string;
    lat: number;
    lng: number;
    distance?: number;
}

interface PlacesMapClientProps {
    places: Place[];
    userLocation: { lat: number; lng: number };
}

export default function PlacesMapClient({ places, userLocation }: PlacesMapClientProps) {
    return (
        <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ width: "100%", height: "400px" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {places.map((place) => (
                <Marker key={place.id} position={[place.lat, place.lng]}>
                    <Popup>
                        <strong>{place.name}</strong>
                        <br />
                        Distance: {place.distance?.toFixed(2)} km
                    </Popup>
                </Marker>
            ))}
            <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>Your Location</Popup>
            </Marker>
        </MapContainer>
    );
}
