"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, MapPin } from "lucide-react";
import type * as LeafletNS from "leaflet";

// Strongly typed reference to leaflet-routing-machine
let Routing: typeof import("leaflet-routing-machine") | null = null;

interface RestaurantMapCardProps {
  location: string;
  lat?: number;
  lng?: number;
}

<<<<<<< HEAD
export default function RestaurantMapCard({
                                              mapSrc,
                                              location,
                                              lat,
                                              lng,
                                          }: RestaurantMapCardProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<LeafletNS.Map | null>(null);
    const routeControlRef = useRef<any>(null);

    const [leaflet, setLeaflet] = useState<typeof LeafletNS | null>(null);
    const [lrm, setLrm] = useState<any>(null);
=======
export default function RestaurantMapCard({ location, lat, lng }: RestaurantMapCardProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  const routeControlRef = useRef<LeafletNS.Control | null>(null);

  const [leaflet, setLeaflet] = useState<typeof LeafletNS | null>(null);
>>>>>>> 0e790886216d75430ba39eed33c0a5a8e5a5bda4

  // Load Leaflet + Routing dynamically
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [{ default: L }, LRM] = await Promise.all([
        import("leaflet"),
        import("leaflet-routing-machine"),
      ]);

<<<<<<< HEAD
            if (cancelled) return;
            setLeaflet(L as unknown as typeof LeafletNS);
            // side-effect import registers L.Routing globally
            setLrm((L as any).Routing as any);
        })();
=======
      if (cancelled) return;
>>>>>>> 0e790886216d75430ba39eed33c0a5a8e5a5bda4

      setLeaflet(L);
      Routing = LRM;
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leaflet || !mapContainerRef.current || mapRef.current) return;

    const L = leaflet;

    const DefaultIcon = L.Icon.Default;
    DefaultIcon.mergeOptions({
      iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
      iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
      shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
    });

    const fallbackCenter: [number, number] = [-6.7924, 39.2083];
    const destExists = typeof lat === "number" && typeof lng === "number";

    const map = L.map(mapContainerRef.current, {
      center: destExists ? [lat!, lng!] : fallbackCenter,
      zoom: destExists ? 14 : 12,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    if (destExists) {
      L.marker([lat!, lng!])
        .addTo(map)
        .bindPopup(`<b>${location}</b>`)
        .openPopup();
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [leaflet, lat, lng, location]);

  // Handle directions using leaflet-routing-machine
  const handleGetDirections = () => {
    if (!leaflet || !Routing || !mapRef.current || typeof lat !== "number" || typeof lng !== "number")
      return;

    const L = leaflet;
    const map = mapRef.current;

    if (routeControlRef.current) {
      map.removeControl(routeControlRef.current);
      routeControlRef.current = null;
    }

    const createRoute = (originLat: number, originLng: number) => {
      const plan = Routing!.plan(
        [L.latLng(originLat, originLng), L.latLng(lat, lng)],
        {
          createMarker: (_i: number, wp: LeafletNS.Waypoint) => L.marker(wp.latLng),
          draggableWaypoints: false,
          addWaypoints: false,
          routeWhileDragging: false,
          show: false,
        }
      );

      const control = Routing!.control({
        plan,
        lineOptions: {
          addWaypoints: false,
          extendToWaypoints: true,
          missingRouteTolerance: 0,
        },
        router: Routing!.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "driving",
        }),
        fitSelectedRoutes: true,
        showAlternatives: false,
        collapsible: true,
      });

<<<<<<< HEAD
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
                    createMarker: (i: any, wp: any) => L.marker(wp.latLng),
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
=======
      control.addTo(map);
      routeControlRef.current = control;
>>>>>>> 0e790886216d75430ba39eed33c0a5a8e5a5bda4
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => createRoute(pos.coords.latitude, pos.coords.longitude),
        () => alert("Could not get location. Showing destination only."),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  // Handle Bolt ride deep link
  const handleRideWithBolt = () => {
    if (typeof lat !== "number" || typeof lng !== "number") return;

    const getUserLocation = (
      callback: (pos: { lat: number; lng: number } | null) => void
    ) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos: GeolocationPosition) =>
            callback({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => callback(null),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else callback(null);
    };

    getUserLocation((pos) => {
      let deepLink = `bolt://ride?dropoff_lat=${lat}&dropoff_lng=${lng}`;
      if (pos) deepLink += `&pickup_lat=${pos.lat}&pickup_lng=${pos.lng}`;

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = deepLink;
      document.body.appendChild(iframe);

      setTimeout(() => {
        document.body.removeChild(iframe);
        window.location.href = "https://bolt.eu/en/rides/";
      }, 2000);
    });
  };

  return (
    <div className="bg-white border border-transparent rounded-lg mb-6 w-full">
      <div ref={mapContainerRef} className="w-full h-[300px] border-0 relative z-0" />
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
