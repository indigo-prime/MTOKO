// components/PlaceMapCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, MapPin } from "lucide-react";

// Leaflet is browser-only; import dynamically inside effects
import type * as LeafletNS from "leaflet";
import type * as LRMNS from "leaflet-routing-machine";


interface RestaurantMapCardProps {
    mapSrc: string; // kept for compatibility, not used anymore
    location: string;
    lat?: number;
    lng?: number;
}

export default function RestaurantMapCard({
                                              mapSrc,
                                              location,
                                              lat,
                                              lng,
                                          }: RestaurantMapCardProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<LeafletNS.Map | null>(null);
    const routeControlRef = useRef<LRMNS.Routing.Control | null>(null);

    const [leaflet, setLeaflet] = useState<typeof LeafletNS | null>(null);
    const [lrm, setLrm] = useState<typeof LRMNS | null>(null);

    // Load Leaflet + Routing Machine only on client
    useEffect(() => {
        let cancelled = false;

        (async () => {
            const [{ default: L }, _] = await Promise.all([
                import("leaflet"),
                import("leaflet-routing-machine"),
            ]);

            if (cancelled) return;
            setLeaflet(L as unknown as typeof LeafletNS);
            // side-effect import registers L.Routing globally; we only need a type handle to satisfy TS
            setLrm((L as any).Routing as unknown as typeof LRMNS.Routing);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // Initialize map once
    useEffect(() => {
        if (!leaflet || !mapContainerRef.current) return;
        if (mapRef.current) return;

        const L = leaflet;

        // Fix marker icons (client-side only)
        const DefaultIcon = L.Icon.Default;
        DefaultIcon.mergeOptions({
            iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
            iconUrl: require("leaflet/dist/images/marker-icon.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        });

        const fallbackCenter: [number, number] = [-6.7924, 39.2083];
        const destExists = typeof lat === "number" && typeof lng === "number";

        const map = L.map(mapContainerRef.current, {
            center: destExists ? [lat!, lng!] : fallbackCenter,
            zoom: destExists ? 14 : 12,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        if (destExists) {
            L.marker([lat!, lng!]).addTo(map).bindPopup(`<b>${location}</b>`).openPopup();
        }

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [leaflet, lat, lng, location]);

    const handleGetDirections = () => {
        const L = leaflet;
        const Routing = lrm;
        const map = mapRef.current;

        if (!L || !Routing || !map) return;

        if (typeof lat !== "number" || typeof lng !== "number") {
            alert("Location coordinates not available.");
            return;
        }

        // Remove previous route if any
        if (routeControlRef.current) {
            map.removeControl(routeControlRef.current as any);
            routeControlRef.current = null;
        }

        const createRoute = (originLat: number, originLng: number) => {
            // OSRM public demo server (good for PoC; for production you may host your own)
            const plan = Routing.plan(
                [L.latLng(originLat, originLng), L.latLng(lat, lng)],
                {
                    createMarker: (i, wp) => L.marker(wp.latLng),
                    draggableWaypoints: false,
                    addWaypoints: false,
                    routeWhileDragging: false,
                    show: false,
                }
            );

            const control = Routing.control({
                plan,
                lineOptions: {
                    addWaypoints: false,
                    extendToWaypoints: true,
                    missingRouteTolerance: 0,
                    // keep default styling to preserve your appearance
                },
                router: Routing.osrmv1({
                    serviceUrl: "https://router.project-osrm.org/route/v1",
                    profile: "driving",
                }),
                fitSelectedRoutes: true,
                showAlternatives: false,
                collapsible: true,
            });

            control.addTo(map);
            routeControlRef.current = control;
        };

        const openWithUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        createRoute(pos.coords.latitude, pos.coords.longitude);
                    },
                    (err) => {
                        console.warn("Geolocation error:", err);
                        alert(
                            "Couldn't get your current location. Showing the place only."
                        );
                        // Keep only the destination marker; no route possible without origin
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                alert("Geolocation not supported on this device/browser.");
            }
        };

        openWithUserLocation();
    };

    const handleRideWithBolt = () => {
        if (typeof lat !== "number" || typeof lng !== "number") {
            alert("Location coordinates not available.");
            return;
        }

        const getUserLocation = (callback: (pos: { lat: number; lng: number } | null) => void) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => callback({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    () => callback(null),
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                callback(null);
            }
        };

        getUserLocation((pos) => {
            let deepLink = `bolt://ride?dropoff_lat=${lat}&dropoff_lng=${lng}`;
            if (pos) {
                deepLink += `&pickup_lat=${pos.lat}&pickup_lng=${pos.lng}`;
            }

            // Attempt to open deep link
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = deepLink;
            document.body.appendChild(iframe);

            setTimeout(() => {
                document.body.removeChild(iframe);
                // Fallback: Bolt web
                window.location.href = "https://bolt.eu/en/rides/";
            }, 2000);
        });
    };

    return (
        <div className="bg-white border border-transparent rounded-lg mb-6 w-full">
            {/* Map Container (replaces iframe) */}
            <div className="w-full">
                <div
                    ref={mapContainerRef}
                    className="w-full h-[300px] border-0 relative z-0"
                    // Keeping same height & rounding by container; style matches your current layout
                />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2 mx-3 mb-4 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetDirections}
                    className="flex-1 flex items-center space-x-1"
                >
                    <MapPin className="w-4 h-4" />
                    <span>GET DIRECTIONS</span>
                </Button>

                <Button
                    size="sm"
                    onClick={handleRideWithBolt}
                    className="btn-bolt flex-1 flex items-center space-x-1"
                >
                    <Car className="w-4 h-4" />
                    <span>RIDE WITH BOLT</span>
                </Button>
            </div>
        </div>
    );
}
