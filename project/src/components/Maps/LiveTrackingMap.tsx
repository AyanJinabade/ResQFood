// FILE: src/components/Maps/LiveTrackingMap.tsx

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  restaurantLat: number;
  restaurantLng: number;

  ngoLat: number;
  ngoLng: number;

  restaurantName?: string;
  ngoName?: string;
};

const restaurantIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const ngoIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

/*
=====================================================
DISTANCE CALCULATION
=====================================================
*/

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

export default function LiveTrackingMap({
  restaurantLat,
  restaurantLng,
  ngoLat,
  ngoLng,
  restaurantName = "Restaurant",
  ngoName = "NGO",
}: Props) {
  const [distance, setDistance] =
    useState<number>(0);

  const [etaMinutes, setEtaMinutes] =
    useState<number>(0);

  /*
  =====================================================
  LIVE DISTANCE + ETA
  =====================================================
  */

  useEffect(() => {
    const km =
      getDistanceFromLatLonInKm(
        ngoLat,
        ngoLng,
        restaurantLat,
        restaurantLng
      );

    const finalDistance = Number(
      km.toFixed(2)
    );

    setDistance(finalDistance);

    /*
    Average city speed assumption:
    20 KM / hour
    */

    const eta = Math.ceil(
      (km / 20) * 60
    );

    setEtaMinutes(eta);
  }, [
    restaurantLat,
    restaurantLng,
    ngoLat,
    ngoLng,
  ]);

  /*
  =====================================================
  MAP CENTER
  =====================================================
  */

  const centerLat =
    (restaurantLat + ngoLat) / 2;

  const centerLng =
    (restaurantLng + ngoLng) / 2;

  const routePositions: [number, number][] =
    [
      [ngoLat, ngoLng],
      [restaurantLat, restaurantLng],
    ];

  return (
    <div className="space-y-5">
      {/* Top Summary Card */}
      <div className="bg-white border rounded-2xl shadow-sm p-5">
        <h2 className="text-xl font-bold mb-4">
          Live Pickup Tracking
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Distance */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Distance
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {distance} KM
            </p>
          </div>

          {/* ETA */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Estimated Arrival
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {etaMinutes} mins
            </p>
          </div>

          {/* Status */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Pickup Status
            </p>

            <p className="text-xl font-bold text-green-600">
              Volunteer On The Way
            </p>
          </div>
        </div>
      </div>

      {/* Live Route Map */}
      <div className="h-[460px] rounded-2xl overflow-hidden border shadow-sm">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* NGO Marker */}
          <Marker
            position={[ngoLat, ngoLng]}
            icon={ngoIcon}
          >
            <Popup>
              <div>
                <strong>{ngoName}</strong>
                <br />
                NGO Current Location
              </div>
            </Popup>
          </Marker>

          {/* Restaurant Marker */}
          <Marker
            position={[
              restaurantLat,
              restaurantLng,
            ]}
            icon={restaurantIcon}
          >
            <Popup>
              <div>
                <strong>
                  {restaurantName}
                </strong>
                <br />
                Restaurant Pickup Point
              </div>
            </Popup>
          </Marker>

          {/* Route Line */}
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: "blue",
              weight: 5,
            }}
          />
        </MapContainer>
      </div>

      {/* Bottom Professional Status */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <p className="text-blue-800 font-semibold text-lg">
          NGO is {distance} KM away and expected
          to arrive in {etaMinutes} minutes.
        </p>

        <p className="text-sm text-blue-600 mt-1">
          Live tracking updates automatically
          until pickup is completed.
        </p>
      </div>
    </div>
  );
}