import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  height?: string;
}

const LocationPicker: React.FC<Props> = ({
  initialLat,
  initialLng,
  onLocationSelect,
  height = "300px",
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!mapRef.current) return;

const startLat = initialLat ?? 18.5204;
const startLng = initialLng ?? 73.8567;

leafletMap.current = L.map(mapRef.current!, {
  maxBounds: [
    [18.30, 73.70], 
    [18.70, 74.15], 
  ],
  maxBoundsViscosity: 1.0,
}).setView([startLat, startLng], initialLat ? 15 : 12);

leafletMap.current.setMinZoom(11);
leafletMap.current.setMaxZoom(18);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(leafletMap.current);

    if (initialLat && initialLng) {
      markerRef.current = L.marker([initialLat, initialLng], { draggable: true }).addTo(
        leafletMap.current
      );
      markerRef.current.on("dragend", onDragEvent);
      reverseGeocode(initialLat, initialLng);
    }

    leafletMap.current.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      placeMarker(lat, lng);
      reverseGeocode(lat, lng);
    });

    return () => {
      leafletMap.current?.remove();
    };
  }, []);

  const placeMarker = (lat: number, lng: number) => {
    if (!leafletMap.current) return;
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    else {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(leafletMap.current!);
      markerRef.current.on("dragend", onDragEvent);
    }
    onLocationSelect(lat, lng, address);
  };

  const onDragEvent = (e: any) => {
    const pos = e.target.getLatLng();
    reverseGeocode(pos.lat, pos.lng);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { "User-Agent": "resqfood-app" } }
      );
      const json = await res.json();
      const addr = json.display_name || "";
      setAddress(addr);
      onLocationSelect(lat, lng, addr);
    } catch (err) {
      onLocationSelect(lat, lng);
    }
  };

  return (
    <div>
      <div ref={mapRef} style={{ height }} className="w-full rounded-lg overflow-hidden" />
      <p className="text-sm mt-2 text-gray-600">
        <b>Selected:</b> {address || "Pick a location"}
      </p>
    </div>
  );
};

export default LocationPicker;
