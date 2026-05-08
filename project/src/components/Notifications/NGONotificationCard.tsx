import { useState } from "react";
import { supabase } from "../../context/AuthContext";
import LiveTrackingMap from "../Maps/LiveTrackingMap";

type Props = {
  donation: {
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
      address?: string | null;
      phone?: string | null;
    } | null;
  };

  refreshData: () => void;
};

export default function NGONotificationCard({
  donation,
  refreshData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const isCompleted =
    donation.pickup_status === "completed" ||
    donation.status === "successfully_donated";

  const restaurantName =
    donation.profiles?.full_name || "Restaurant";

  const restaurantAddress =
    donation.profiles?.address || "Address not available";

  const callRestaurant = () => {
    if (donation.profiles?.phone) {
      window.open(`tel:${donation.profiles.phone}`);
    } else {
      alert("Restaurant phone not available");
    }
  };

  const navigateToRestaurant = () => {
    if (
      donation.latitude &&
      donation.longitude
    ) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${donation.latitude},${donation.longitude}`,
        "_blank"
      );
    }
  };

  const cancelPickup = async () => {
    try {
      setLoading(true);

      const restoreQuantity =
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
          remaining_quantity: restoreQuantity,
        })
        .eq("id", donation.id);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      if (donation.donor_id) {
        await supabase
          .from("notifications")
          .insert([
            {
              user_id: donation.donor_id,
              title: "Pickup Cancelled",
              message: `${restaurantName} reservation was cancelled by NGO.`,
              is_read: false,
            },
          ]);
      }

      alert("Pickup cancelled successfully");
      refreshData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsCollected = async () => {
    try {
      setLoading(true);

      /*
        IMPORTANT:
        Use valid enum values only.
        Your DB enum does NOT support "completed"
        so we use:
        pickup_status = collected
        status = successfully_donated
      */

      const { error } = await supabase
        .from("food_donations")
        .update({
          pickup_status: "collected",
          status: "successfully_donated",
          approval_status: "approved",
        })
        .eq("id", donation.id);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      /*
        Restaurant gets completion notification
      */
      if (donation.donor_id) {
        await supabase
          .from("notifications")
          .insert([
            {
              user_id: donation.donor_id,
              title: "Donation Completed",
              message: `${donation.food_name} has been successfully collected by NGO.`,
              is_read: false,
            },
          ]);
      }

      /*
        NGO gets success notification
      */
      if (donation.reserved_by) {
        await supabase
          .from("notifications")
          .insert([
            {
              user_id: donation.reserved_by,
              title: "Pickup Completed",
              message: `You successfully collected ${donation.food_name}.`,
              is_read: false,
            },
          ]);
      }

      alert("Donation collected successfully");
      refreshData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-2xl font-bold">
            NGO Pickup Tracking
          </h2>

          <p className="text-gray-500 mt-1">
            Professional pickup management
          </p>
        </div>

        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
          {isCompleted
            ? "successfully_donated"
            : donation.pickup_status || "reserved"}
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
            <b>Restaurant Address:</b>{" "}
            {restaurantAddress}
          </p>

          <p>
            <b>Food Collected:</b>{" "}
            {donation.food_name}
          </p>

          <p>
            <b>Quantity Received:</b>{" "}
            {donation.requested_quantity} kg
          </p>

          <p>
            <b>Pickup Date:</b>{" "}
            {donation.reserve_date}
          </p>

          <p>
            <b>Collection Time:</b>{" "}
            {donation.reserve_time}
          </p>

          <p className="text-green-700 font-semibold">
            Final Pickup Status: Completed
          </p>

          <p className="text-green-700 font-semibold">
            Collection Status:
            Successfully Collected
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium">
            Donation Collected Successfully
          </div>
        </div>
      ) : (
        <>
          {/* ACTIVE PICKUP FLOW */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p>
                <b>Restaurant Name:</b>{" "}
                {restaurantName}
              </p>

              <p>
                <b>Restaurant Address:</b>{" "}
                {restaurantAddress}
              </p>

              <p>
                <b>Reserved Food:</b>{" "}
                {donation.food_name}
              </p>

              <p>
                <b>Reserved Quantity:</b>{" "}
                {donation.requested_quantity} kg
              </p>

              <p>
                <b>Pickup Date:</b>{" "}
                {donation.reserve_date}
              </p>

              <p>
                <b>Pickup Time:</b>{" "}
                {donation.reserve_time}
              </p>

              <p>
                <b>Approval Status:</b>{" "}
                {donation.approval_status ||
                  "Pending"}
              </p>
            </div>

            <div>
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
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={navigateToRestaurant}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold"
            >
              Navigate to Restaurant
            </button>

            <button
              onClick={callRestaurant}
              className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold"
            >
              Call Restaurant
            </button>

            <button
              onClick={cancelPickup}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold"
            >
              Cancel Pickup
            </button>

            {donation.approval_status ===
              "approved" && (
              <button
                onClick={markAsCollected}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold"
              >
                Mark as Collected
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}