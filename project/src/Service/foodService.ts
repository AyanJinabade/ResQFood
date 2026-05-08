import { supabase } from "../context/AuthContext";

/**
 * Inserts a new food donation into the Supabase 'food_donations' table.
 * Automatically links the current user's profile as donor_id.
 */
export async function addFoodDonation(food: any, userEmail: string) {
  try {
    // 🔹 Get user's profile ID (since donor_id references profiles.id, not auth.users.id)
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("email", userEmail)
      .single();

    if (profileErr || !profile) {
      console.error("Profile not found for user:", profileErr?.message);
      return null;
    }

    const { data, error } = await supabase
      .from("food_donations")
      .insert([
        {
          donor_id: profile.id, // ✅ Correct FK -> profiles.id
          donor_name: profile.full_name || food.donor_name || "Anonymous",
          food_name: food.food_name,
          food_type: food.food_type,
          quantity: parseInt(food.quantity, 10) || 0,
          pickup_time: food.pickup_time,
          expiry_time: food.expiry_time,
          address: food.address,
          description: food.description,
          status: "available",
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Insert donation failed:", error.message);
      return null;
    }

    console.log("Donation added successfully:", data);
    return data;
  } catch (err: any) {
    console.error("Unexpected error while inserting donation:", err.message);
    return null;
  }
}

/**
 * Fetch all available food donations (for NGO dashboard)
 */
export async function getAvailableDonations() {
  try {
    const { data, error } = await supabase
      .from("food_donations")
      .select(
        "id, donor_name, food_name, food_type, quantity, pickup_time, expiry_time, address, description, status"
      )
      .eq("status", "available")
      .order("pickup_time", { ascending: true });

    if (error) {
      console.error("Failed to fetch donations:", error.message);
      return [];
    }

    return data || [];
  } catch (err: any) {
    console.error("Unexpected error fetching donations:", err.message);
    return [];
  }
}

/**
 * Update donation status (e.g., mark as 'reserved', 'collected', 'expired')
 */
export async function updateDonationStatus(donationId: string, newStatus: string, ngoId?: string) {
  try {
    const updateData: any = { status: newStatus };
    if (newStatus === "reserved" && ngoId) {
      updateData.reserved_by = ngoId;
      updateData.confirmed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("food_donations")
      .update(updateData)
      .eq("id", donationId);

    if (error) {
      console.error("Failed to update donation status:", error.message);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("Unexpected error updating status:", err.message);
    return false;
  }
}
