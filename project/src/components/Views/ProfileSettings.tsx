// src/components/Views/ProfileSettings.tsx
import React, { useState, useEffect } from "react";
import { useAuth, supabase } from "../../context/AuthContext";
import LocationPicker from "../Maps/LocationPicker";

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfileCoords() {
      if (!user?.email) return;
      const { data: profile } = await supabase.from("profiles").select("latitude, longitude").eq("email", user.email).single();
      if (profile) {
        setLat(profile.latitude ?? null);
        setLng(profile.longitude ?? null);
      }
    }
    fetchProfileCoords();
  }, [user]);

  const handleLocationSelect = (plat: number, plng: number) => {
    setLat(plat);
    setLng(plng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Update profiles table for lat/lng (and optionally users table)
    try {
      // Update profiles
      const { error: err1 } = await supabase
        .from("profiles")
        .update({ latitude: lat, longitude: lng, full_name: formData.full_name })
        .eq("email", user?.email);

      if (err1) throw err1;

      // Update users table if you keep a separate users table
      await updateProfile({ full_name: formData.full_name, phone: formData.phone, address: formData.address });

      alert("Profile updated!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      alert("Could not update profile: " + (err?.message ?? ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input className="w-full border p-3 rounded-lg" placeholder="Organization Name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
          <input className="w-full border p-3 rounded-lg" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <input className="w-full border p-3 rounded-lg" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

          <div>
            <label className="block mb-2 font-medium">Set your location (for NGOs)</label>
            <LocationPicker initialLat={lat} initialLng={lng} onLocationSelect={(plat, plng) => handleLocationSelect(plat, plng)} height={300} />
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
