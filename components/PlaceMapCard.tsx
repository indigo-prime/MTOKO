/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, MapPin } from "lucide-react";
import type * as LeafletNS from "leaflet";

// Fix: declare the module safely
declare module "leaflet-routing-machine" {
  import * as L from "leaflet";
  export namespace Routing {
    interface PlanOptions extends L.Routing.PlanOptions {}
    interface ControlOptions extends L.Routing.ControlOptions {}

    function plan(waypoints: L.LatLng[], options?: PlanOptions): L.Routing.Plan;
    function control(options: ControlOptions): L.Routing.Control;
    function osrmv1(options?: { serviceUrl?: string; profile?: string }): any;

    class Plan extends L.Class {}
    class Control extends L.Control {}
  }
}

interface RestaurantMapCardProps {
  mapSrc?: string;
  location: string;
  lat?: number;
  lng?: number;
}

export default function RestaurantMapCard({
  location,
  lat,
  lng,
}: RestaurantMapCardProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  const routeControlRef = useRef<any>(null);

  const [leaflet, setLeaflet] = useState<typeof LeafletNS | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [{ default: L }] = await Promise.all([
        import("leaflet"),
        import("leaflet-routing-machine"), // ensures side effects load
      ]);
      if (cancelled) return;
      setLeaflet(L);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!leaflet || !mapContainerRef.current || mapRef.current) return;

    const L = leaflet;

    const DefaultIcon = L.Icon.Default;
    DefaultIcon.mergeOptions({
      iconRetinaUrl: new URL(
        "leaflet/dist/images/marker-icon-2x.png",
        import.meta.url
      ).toString(),
      iconUrl: new URL(
        "leaflet/dist/images/marker-icon.png",
        import.meta.url
      ).toString(),
      shadowUrl: new URL(
        "leaflet/dist/images/marker-shadow.png",
        import.meta.url
      ).toString(),
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

    if (destExists)
      L.marker([lat!, lng!])
        .addTo(map)
        .bindPopup(`<b>${location}</b>`)
        .openPopup();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [leaflet, lat, lng, location]);

  const handleGetDirections = async () => {
    if (!leaflet || !mapRef.current || typeof lat !== "number" || typeof lng !== "number") return;

    const L = leaflet;
    const Routing = (await import("leaflet-routing-machine")).Routing;

    const map = mapRef.current;

    if (routeControlRef.current) {
      map.removeControl(routeControlRef.current);
      routeControlRef.current = null;
    }

    const createRoute = (originLat: number, originLng: number) => {
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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => createRoute(pos.coords.latitude, pos.coords.longitude),
        () => alert("Could not get location. Showing destination only."),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  const handleRideWithBolt = () => {
    if (typeof lat !== "number" || typeof lng !== "number") return;

    const getUserLocation = (
      callback: (pos: { lat: number; lng: number } | null) => void
    ) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => callback({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
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
      <div
        ref={mapContainerRef}
        className="w-full h-[300px] border-0 relative z-0"
      />
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
