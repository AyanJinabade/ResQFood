import React, {
  useEffect,
  useState,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  supabase,
  useAuth,
} from "../../context/AuthContext";

type Position = {
  lat: number;
  lng: number;
};

/*
=================================================
MAP CENTER FIX
When saved location loads,
map must move to new location
=================================================
*/

function ChangeMapView({
  position,
}: {
  position: Position;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [position.lat, position.lng],
      13
    );
  }, [position, map]);

  return null;
}

/*
=================================================
CLICK TO SELECT LOCATION
=================================================
*/

function LocationMarker({
  position,
  setPosition,
}: {
  position: Position;
  setPosition: (
    pos: Position
  ) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return (
    <Marker
      position={[
        position.lat,
        position.lng,
      ]}
    />
  );
}

export default function NGOProfileLocation() {
  const { user } = useAuth();

  const [position, setPosition] =
    useState<Position>({
      lat: 18.5204, // Pune default
      lng: 73.8567,
    });

  const [address, setAddress] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
  =================================================
  FETCH SAVED LOCATION
  =================================================
  */

  async function fetchSavedLocation() {
    if (!user?.email) return;

    try {
      const { data, error } =
        await supabase
          .from("profiles")
          .select(`
            id,
            latitude,
            longitude,
            address
          `)
          .eq("email", user.email)
          .single();

      if (error) {
        console.error(error);
        return;
      }

      if (!data) return;

      /*
      IMPORTANT FIX:
      Use !== null
      because 0 is valid value
      */

      if (
        data.latitude !== null &&
        data.longitude !== null
      ) {
        setPosition({
          lat: Number(data.latitude),
          lng: Number(
            data.longitude
          ),
        });
      }

      if (data.address) {
        setAddress(data.address);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /*
  =================================================
  REVERSE GEOCODE ADDRESS
  =================================================
  */

  async function fetchAddress(
    lat: number,
    lng: number
  ) {
    try {
      const response =
        await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

      const data =
        await response.json();

      if (data?.display_name) {
        return data.display_name;
      }

      return "";
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  /*
  =================================================
  SAVE LOCATION
  =================================================
  */

  async function saveLocation() {
    if (!user?.email) return;

    try {
      setLoading(true);

      /*
      STEP 1 → GET PROFILE
      */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .single();

      if (
        profileError ||
        !profile?.id
      ) {
        console.error(
          profileError
        );
        alert(
          "Profile not found"
        );
        setLoading(false);
        return;
      }

      /*
      STEP 2 → GET FRESH ADDRESS
      IMPORTANT FIX:
      Do NOT use old state value
      */

      const latestAddress =
        await fetchAddress(
          position.lat,
          position.lng
        );

      /*
      STEP 3 → SAVE TO DB
      */

      const { error } =
        await supabase
          .from("profiles")
          .update({
            latitude:
              position.lat,
            longitude:
              position.lng,
            address:
              latestAddress ||
              address,
          })
          .eq(
            "id",
            profile.id
          );

      if (error) {
        console.error(error);
        alert(
          error.message
        );
        setLoading(false);
        return;
      }

      /*
      STEP 4 → UPDATE LOCAL UI
      */

      if (latestAddress) {
        setAddress(
          latestAddress
        );
      }

      alert(
        "Location saved successfully"
      );

      /*
      STEP 5 → REFRESH FROM DB
      */

      await fetchSavedLocation();
    } catch (error) {
      console.error(error);
      alert(
        "Failed to save location"
      );
    }

    setLoading(false);
  }

  /*
  =================================================
  INITIAL LOAD
  =================================================
  */

  useEffect(() => {
    fetchSavedLocation();
  }, [user]);

  /*
  =================================================
  LIVE ADDRESS UPDATE WHEN CLICKING MAP
  =================================================
  */

  useEffect(() => {
    async function updateLiveAddress() {
      const latestAddress =
        await fetchAddress(
          position.lat,
          position.lng
        );

      if (latestAddress) {
        setAddress(
          latestAddress
        );
      }
    }

    updateLiveAddress();
  }, [position]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Set NGO Location
      </h1>

      <div className="bg-white p-6 rounded-xl shadow border">
        <div className="h-[450px] rounded-xl overflow-hidden border">
          <MapContainer
            center={[
              position.lat,
              position.lng,
            ]}
            zoom={13}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <ChangeMapView
              position={
                position
              }
            />

            <LocationMarker
              position={
                position
              }
              setPosition={
                setPosition
              }
            />
          </MapContainer>
        </div>

        <div className="mt-6">
          <p className="text-lg">
            <b>Selected:</b>{" "}
            {address ||
              "No location selected"}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Lat:{" "}
            {position.lat.toFixed(
              6
            )}{" "}
            | Lng:{" "}
            {position.lng.toFixed(
              6
            )}
          </p>

          <button
            onClick={
              saveLocation
            }
            disabled={loading}
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {loading
              ? "Saving..."
              : "Save Location"}
          </button>
        </div>
      </div>
    </div>
  );
}