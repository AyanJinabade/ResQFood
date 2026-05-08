import { useState } from "react";
import { supabase } from "../../context/AuthContext";
import LiveTrackingMap from "../Maps/LiveTrackingMap";

type Donation = {
  id: string;
  food_name: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  requested_quantity: number | null;

  status: string | null;
  pickup_status: string | null;
  approval_status: string | null;

  reserve_date: string | null;
  reserve_time: string | null;

  latitude: number | null;
  longitude: number | null;

  ngo_lat: number | null;
  ngo_lng: number | null;

  donor_id: string | null;
  reserved_by: string | null;

  profiles?: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  } | null;
};

type Props = {
  donation: Donation;
  refreshData: () => void;
};

export default function RestaurantNotificationCard({
  donation,
  refreshData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const isCompleted =
    donation.pickup_status === "collected" ||
    donation.status === "successfully_donated";

  const isApproved =
    donation.approval_status === "approved";

  const ngoName =
    donation.profiles?.full_name ||
    donation.profiles?.email ||
    "NGO";

  const restaurantName = "Restaurant";

  const acceptedFullFood =
    (donation.remaining_quantity || 0) === 0;

  function getDistanceInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;
    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return (R * c).toFixed(1);
  }

  const distance =
    donation.latitude &&
    donation.longitude &&
    donation.ngo_lat &&
    donation.ngo_lng
      ? getDistanceInKm(
          donation.latitude,
          donation.longitude,
          donation.ngo_lat,
          donation.ngo_lng
        )
      : "0";

  const etaMinutes = Math.max(
    5,
    Math.round(Number(distance) * 3)
  );

  async function approvePickup() {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("food_donations")
        .update({
          approval_status: "approved",
          pickup_status: "pickup_in_progress",
        })
        .eq("id", donation.id);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      if (donation.reserved_by) {
        await supabase
          .from("notifications")
          .insert([
            {
              user_id: donation.reserved_by,
              title: "Pickup Approved",
              message: `Your pickup for ${donation.food_name} has been approved by restaurant.`,
              is_read: false,
            },
          ]);
      }

      alert("Pickup approved successfully");
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function rejectRequest() {
    try {
      setLoading(true);

      const restoredQuantity =
        (donation.remaining_quantity || 0) +
        (donation.requested_quantity || 0);

      const { error } = await supabase
        .from("food_donations")
        .update({
          status: "available",
          pickup_status: null,
          approval_status: null,
          reserved_by: null,
          requested_quantity: null,
          reserve_date: null,
          reserve_time: null,
          ngo_lat: null,
          ngo_lng: null,
          remaining_quantity: restoredQuantity,
        })
        .eq("id", donation.id);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      if (donation.reserved_by) {
        await supabase
          .from("notifications")
          .insert([
            {
              user_id: donation.reserved_by,
              title: "Pickup Rejected",
              message: `Your request for ${donation.food_name} was rejected by restaurant.`,
              is_read: false,
            },
          ]);
      }

      alert("Request rejected successfully");
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function contactNGO() {
    if (donation.profiles?.phone) {
      window.open(
        `tel:${donation.profiles.phone}`
      );
    } else {
      alert("NGO phone not available");
    }
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-2xl font-bold">
            NGO Reservation Request
          </h2>

          <p className="text-gray-500 mt-1">
            Live pickup tracking and
            reservation management
          </p>
        </div>

        <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
          {isCompleted
            ? "successfully_donated"
            : donation.pickup_status ||
              "reserved"}
        </span>
      </div>

      {/* FINAL COMPLETED STATE */}
      {isCompleted ? (
        <div className="space-y-4">
          <p>
            <b>Restaurant Name:</b>{" "}
            {restaurantName}
          </p>

          <p>
            <b>NGO Name:</b> {ngoName}
          </p>

          <p>
            <b>Food Name:</b>{" "}
            {donation.food_name}
          </p>

          <p>
            <b>Quantity Donated:</b>{" "}
            {donation.requested_quantity} kg
          </p>

          <p>
            <b>Donation Date:</b>{" "}
            {donation.reserve_date}
          </p>

          <p>
            <b>Donation Time:</b>{" "}
            {donation.reserve_time}
          </p>

          <p className="text-green-700 font-semibold">
            Final Pickup Status: Completed
          </p>

          <p className="text-green-700 font-semibold">
            Donation Status:
            Successfully Donated
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium">
            Donated Successfully
          </div>
        </div>
      ) : (
        <>
          {/* ACTIVE FLOW */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p>
                <b>Restaurant Name:</b>{" "}
                {restaurantName}
              </p>

              <p>
                <b>NGO Name:</b> {ngoName}
              </p>

              <p>
                <b>Food Name:</b>{" "}
                {donation.food_name}
              </p>

              <p>
                <b>Accepted Quantity:</b>{" "}
                {donation.requested_quantity} kg
              </p>

              {acceptedFullFood && (
                <p className="text-green-700 font-semibold">
                  Accepted Full Food Quantity
                </p>
              )}

              <p>
                <b>Remaining Quantity:</b>{" "}
                {donation.remaining_quantity} kg
              </p>

              <p>
                <b>Reserved Pickup Date:</b>{" "}
                {donation.reserve_date}
              </p>

              <p>
                <b>Reserved Pickup Time:</b>{" "}
                {donation.reserve_time}
              </p>
            </div>

            <div className="space-y-3">
              <p>
                <b>Pickup Status:</b>{" "}
                {donation.pickup_status ||
                  "reserved"}
              </p>

              <p>
                <b>Approval Status:</b>{" "}
                {donation.approval_status ||
                  "Pending"}
              </p>

              <p>
                <b>Distance from Restaurant:</b>{" "}
                {distance} KM
              </p>

              <p>
                <b>Estimated Arrival Time:</b>{" "}
                {etaMinutes} minutes
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700 font-medium">
                NGO is on the way — {distance} KM,
                arriving in {etaMinutes} minutes
              </div>
            </div>
          </div>

          {/* Live tracking only before completion */}
          {!isCompleted && (
            <>
              <div className="mt-6 mb-4 font-semibold">
                Live Route Tracking
              </div>

              <LiveTrackingMap
                restaurantLat={
                  donation.latitude || 0
                }
                restaurantLng={
                  donation.longitude || 0
                }
                ngoLat={donation.ngo_lat || 0}
                ngoLng={donation.ngo_lng || 0}
              />
            </>
          )}

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-6">
            {!isApproved ? (
              <>
                <button
                  onClick={approvePickup}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold"
                >
                  Approve Pickup
                </button>

                <button
                  onClick={rejectRequest}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold"
                >
                  Reject Request
                </button>
              </>
            ) : (
              <div className="px-6 py-3 rounded-xl bg-blue-100 text-blue-700 font-semibold">
                Arriving
              </div>
            )}

            <button
              onClick={contactNGO}
              className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold"
            >
              Contact NGO
            </button>
          </div>
        </>
      )}
    </div>
  );
}