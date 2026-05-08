import React, { useState } from "react";
import { supabase, useAuth } from "../../context/AuthContext";
import LocationPicker from "../Maps/LocationPicker";

export default function AddFoodForm() {
  const { user } = useAuth();

  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState("kg");

  const [pickupTime, setPickupTime] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!user?.email) {
      setMessage("User not found");
      return;
    }

    if (!latitude || !longitude) {
      setMessage("Please select donation location");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Get restaurant profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("email", user.email)
        .single();

      if (!profile?.id) {
        setMessage("Profile not found");
        setLoading(false);
        return;
      }

      let imageUrl = "";

      // Optional image upload
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("food-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error(uploadError);
        } else {
          const { data } = supabase.storage
            .from("food-images")
            .getPublicUrl(fileName);

          imageUrl = data.publicUrl;
        }
      }

      // Insert donation
      const { error } = await supabase
        .from("food_donations")
        .insert([
          {
            donor_id: profile.id,
            donor_name:
              profile.full_name || "Restaurant",

            food_name: foodName,

            // IMPORTANT:
            // Must match enum exactly
            // use non_veg not non-veg
            food_type: foodType,

            quantity: Number(quantity),

            // IMPORTANT FIX
            // Automatically set remaining quantity
            remaining_quantity: Number(quantity),

            // Initial requested quantity
            requested_quantity: 0,

            unit,

            pickup_time: pickupTime,
            expiry_time: expiryTime,

            latitude,
            longitude,
            address,

            image_url: imageUrl,

            // NOT NULL fix
            description:
              "Fresh food donation available",

            status: "available",
          },
        ]);

      if (error) {
        console.error(error);
        setMessage(error.message);
      } else {
        setMessage(
          "Food donation added successfully"
        );

        // Reset form
        setFoodName("");
        setFoodType("veg");
        setQuantity(1);
        setUnit("kg");
        setPickupTime("");
        setExpiryTime("");
        setImageFile(null);
        setLatitude(null);
        setLongitude(null);
        setAddress("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Add Food Donation
      </h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-50 text-green-700">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Food Name */}
        <div>
          <label className="block font-medium mb-1">
            Food Name
          </label>
          <input
            type="text"
            value={foodName}
            onChange={(e) =>
              setFoodName(e.target.value)
            }
            required
            className="w-full border rounded-lg p-3"
            placeholder="Enter food name"
          />
        </div>

        {/* Food Type */}
        <div>
          <label className="block font-medium mb-1">
            Food Type
          </label>
          <select
            value={foodType}
            onChange={(e) =>
              setFoodType(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="veg">Veg</option>
            <option value="non_veg">
              Non Veg
            </option>
            <option value="packaged">
              Packaged
            </option>
          </select>
        </div>

        {/* Quantity + Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number(e.target.value)
                )
              }
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            >
              <option value="kg">KG</option>
              <option value="grams">
                Grams
              </option>
            </select>
          </div>
        </div>

        {/* Pickup Time */}
        <div>
          <label className="block font-medium mb-1">
            Pickup Time
          </label>
          <input
            type="datetime-local"
            value={pickupTime}
            onChange={(e) =>
              setPickupTime(e.target.value)
            }
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Expiry Time */}
        <div>
          <label className="block font-medium mb-1">
            Expiry Time
          </label>
          <input
            type="datetime-local"
            value={expiryTime}
            onChange={(e) =>
              setExpiryTime(e.target.value)
            }
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Upload Image */}
        <div>
          <label className="block font-medium mb-1">
            Food Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                e.target.files?.[0] || null
              )
            }
            className="w-full"
          />
        </div>

        {/* Location Picker */}
        <div>
          <label className="block font-medium mb-2">
            Donation Location
          </label>

          <LocationPicker
            onLocationSelect={(
              lat,
              lng,
              selectedAddress
            ) => {
              setLatitude(lat);
              setLongitude(lng);
              setAddress(
                selectedAddress || ""
              );
            }}
            height="350px"
          />

          {address && (
            <p className="mt-2 text-sm text-gray-600">
              <b>Selected Address:</b>{" "}
              {address}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading
            ? "Submitting..."
            : "Add Donation"}
        </button>
      </form>
    </div>
  );
}