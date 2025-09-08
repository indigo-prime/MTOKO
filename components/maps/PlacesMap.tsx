"use client";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Place {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    distance?: number;
}

interface PlacesMapProps {
    places: Place[];
    userLocation: { lat: number; lng: number };
}

export default function PlacesMap({ places, userLocation }: PlacesMapProps) {
    return (
        <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* User marker */}
            <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={new L.Icon.Default()}
            >
                <Popup>You are here</Popup>
            </Marker>

            {/* Places markers */}
            {places.map((place) => (
                <Marker
                    key={place.id}
                    position={[place.latitude, place.longitude]}
                    icon={new L.Icon.Default()}
                >
                    <Popup>
                        <strong>{place.name}</strong>
                        <br />
                        {place.distance?.toFixed(2)} km away
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
