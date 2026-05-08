// FILE: src/components/Food/AvailableDonations.tsx

import React, { useEffect, useState } from "react";
import { supabase, useAuth } from "../../context/AuthContext";

type Donation = {
  id: string;

  food_name?: string | null;
  quantity?: number | null;
  remaining_quantity?: number | null;
  requested_quantity?: number | null;
  unit?: string | null;

  food_type?: string | null;
  description?: string | null;

  status?: string | null;
  pickup_status?: string | null;
  approval_status?: string | null;

  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;

  donor_id?: string | null;
  restaurant_name?: string | null;
};

export default function AvailableDonations() {
  const { user } = useAuth();

  const [donations, setDonations] = useState<
    Donation[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [ngoLat, setNgoLat] = useState<
    number | null
  >(null);

  const [ngoLng, setNgoLng] = useState<
    number | null
  >(null);

  const [requestedQty, setRequestedQty] =
    useState<Record<string, number>>({});

  const [reserveDate, setReserveDate] =
    useState<Record<string, string>>({});

  const [reserveTime, setReserveTime] =
    useState<Record<string, string>>({});

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

  /*
  =====================================================
  NGO LIVE LOCATION
  =====================================================
  */

  useEffect(() => {
    if (!user?.email) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setNgoLat(lat);
        setNgoLng(lng);

        const { data: profile } =
          await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("email", user.email)
            .single();

        if (!profile) return;

        // Save NGO live location
        await supabase
          .from("profiles")
          .update({
            latitude: lat,
            longitude: lng,
          })
          .eq("id", profile.id);
      }
    );
  }, [user]);

  /*
  =====================================================
  FETCH AVAILABLE DONATIONS
  =====================================================
  */

  async function fetchAvailableDonations() {
    try {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("food_donations")
        .select(`
          id,
          donor_id,

          food_name,
          quantity,
          remaining_quantity,
          requested_quantity,
          unit,

          food_type,
          description,

          status,
          pickup_status,
          approval_status,

          latitude,
          longitude,
          address,

          restaurant_name
        `)
        .eq("status", "available")
        .gt("remaining_quantity", 0)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      /*
      =================================================
      FILTER ONLY WITHIN 5KM
      =================================================
      */

      const nearby =
        data?.filter((d) => {
          if (
            !d.latitude ||
            !d.longitude ||
            !ngoLat ||
            !ngoLng
          )
            return false;

          const distance =
            getDistanceFromLatLonInKm(
              ngoLat,
              ngoLng,
              d.latitude,
              d.longitude
            );

          return distance <= 5;
        }) || [];

      setDonations(nearby);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  /*
  =====================================================
  RESERVE FOOD
  =====================================================
  */

  async function reserveFood(
    donation: Donation
  ) {
    try {
      if (!user?.email) return;

      const qty =
        requestedQty[donation.id] || 1;

      if (
        qty <= 0 ||
        qty >
          Number(
            donation.remaining_quantity || 0
          )
      ) {
        alert(
          "Invalid requested quantity"
        );
        return;
      }

      if (
        !reserveDate[donation.id] ||
        !reserveTime[donation.id]
      ) {
        alert(
          "Please select reserve date and time"
        );
        return;
      }

      const {
        data: profile,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          latitude,
          longitude
        `)
        .eq("email", user.email)
        .single();

      if (!profile) return;

      const newRemaining =
        Number(
          donation.remaining_quantity || 0
        ) - qty;

      const distance =
        ngoLat &&
        ngoLng &&
        donation.latitude &&
        donation.longitude
          ? getDistanceFromLatLonInKm(
              ngoLat,
              ngoLng,
              donation.latitude,
              donation.longitude
            )
          : null;

      const eta =
        distance
          ? Math.ceil(
              (distance / 20) * 60
            )
          : null;

      /*
      ===============================================
      SAVE RESERVATION
      ===============================================
      */

      await supabase
        .from("food_donations")
        .update({
          reserved_by: profile.id,

          requested_quantity: qty,
          remaining_quantity:
            newRemaining,

          reserve_date:
            reserveDate[
              donation.id
            ],
          reserve_time:
            reserveTime[
              donation.id
            ],

          ngo_lat: ngoLat,
          ngo_lng: ngoLng,

          ngo_name:
            profile.full_name,

          status: "reserved",
          pickup_status:
            "reserved",
          approval_status:
            "pending",

          distance_km:
            distance?.toFixed(2) ||
            null,
          eta_minutes: eta,
        })
        .eq("id", donation.id);

      alert(
        "Food reserved successfully"
      );

      fetchAvailableDonations();
    } catch (error) {
      console.error(error);
    }
  }

  /*
  =====================================================
  REALTIME
  =====================================================
  */

  useEffect(() => {
    fetchAvailableDonations();

    const channel = supabase
      .channel("available_food_live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "food_donations",
        },
        () => {
          fetchAvailableDonations();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [ngoLat, ngoLng]);

  /*
  =====================================================
  UI STATES
  =====================================================
  */

  if (loading) {
    return (
      <div className="p-6">
        Loading available donations...
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="p-6">
        No food available nearby.
      </div>
    );
  }

  /*
  =====================================================
  MAIN UI
  =====================================================
  */

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Available Donations
      </h1>

      {donations.map((d) => (
        <div
          key={d.id}
          className="bg-white border rounded-2xl shadow-sm p-6 space-y-5"
        >
          <h2 className="text-xl font-bold">
            {d.food_name}
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <p>
                <b>Restaurant:</b>{" "}
                {d.restaurant_name ||
                  "Restaurant"}
              </p>

              <p>
                <b>Quantity:</b>{" "}
                {d.remaining_quantity}{" "}
                {d.unit || "kg"}
              </p>

              <p>
                <b>Food Type:</b>{" "}
                {d.food_type}
              </p>

              <p>
                <b>Address:</b>{" "}
                {d.address}
              </p>
            </div>

            <div className="space-y-3">
              {/* Requested Quantity */}
              <input
                type="number"
                min={1}
                max={
                  d.remaining_quantity || 1
                }
                placeholder="Enter quantity"
                className="w-full border rounded-lg px-4 py-3"
                value={
                  requestedQty[d.id] || ""
                }
                onChange={(e) =>
                  setRequestedQty({
                    ...requestedQty,
                    [d.id]: Number(
                      e.target.value
                    ),
                  })
                }
              />

              {/* Reserve Date */}
              <input
                type="date"
                className="w-full border rounded-lg px-4 py-3"
                value={
                  reserveDate[d.id] || ""
                }
                onChange={(e) =>
                  setReserveDate({
                    ...reserveDate,
                    [d.id]:
                      e.target.value,
                  })
                }
              />

              {/* Reserve Time */}
              <input
                type="time"
                className="w-full border rounded-lg px-4 py-3"
                value={
                  reserveTime[d.id] || ""
                }
                onChange={(e) =>
                  setReserveTime({
                    ...reserveTime,
                    [d.id]:
                      e.target.value,
                  })
                }
              />

              <button
                onClick={() =>
                  reserveFood(d)
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
              >
                Reserve Food
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}