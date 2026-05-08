import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../context/AuthContext";
import { useState } from "react";

export default function FoodCard({ donation }: any) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleClaim = async () => {
    setBusy(true);
    await supabase.from("food_donations").update({ status: "claimed" }).eq("id", donation.id);
    setBusy(false);
    alert("You have requested a pickup.");
    window.location.reload();
  };

  const handleCollected = async () => {
    setBusy(true);
    await supabase.from("food_donations").update({ status: "collected" }).eq("id", donation.id);
    setBusy(false);
    alert("Marked as collected.");
    window.location.reload();
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">{donation.food_name}</h3>
      <p className="text-gray-600">{donation.quantity}</p>
      <p className="text-gray-600">Pickup: {new Date(donation.pickup_time).toLocaleString()}</p>
      <p className="text-gray-500 text-sm">{donation.address}</p>

      {/* ✅ Role-specific Buttons */}
      {user?.role === "ngo" && donation.status === "available" && (
        <button
          onClick={handleClaim}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
          disabled={busy}
        >
          Claim Pickup
        </button>
      )}

      {(user?.role === "restaurant" || user?.role === "society") &&
        donation.status === "claimed" && (
          <button
            onClick={handleCollected}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            disabled={busy}
          >
            Mark as Collected
          </button>
        )}
    </div>
  );
}
