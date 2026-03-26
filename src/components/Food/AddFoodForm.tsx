import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// ---------------- TYPES ----------------
interface FoodDonationInput {
  donor_id: string;
  food_name: string;
  food_type: 'meals' | 'bakery' | 'fruits' | 'vegetables' | 'dairy' | 'other';
  quantity: number;
  unit: string;
  description: string;
  image_url?: string;
  freshness_score: number;
  expiry_time: string;
  status: 'available';
  pickup_instructions?: string;
  dietary_info?: string[];
  allergen_info?: string[];
}

const AddFoodForm = () => {
  const { user, profile } = useAuth();
  const { addDonation } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    foodName: '',
    foodType: 'meals' as FoodDonationInput['food_type'],
    quantity: '',
    unit: 'servings',
    description: '',
    expiryHours: '4',
    imageUrl: '',
    pickupInstructions: '',
    dietaryInfo: [] as string[],
    allergenInfo: [] as string[],
  });

  const foodTypes = [
    { value: 'meals', label: 'Prepared Meals', icon: '🍽️' },
    { value: 'bakery', label: 'Bakery Items', icon: '🍞' },
    { value: 'fruits', label: 'Fresh Fruits', icon: '🍎' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'dairy', label: 'Dairy Products', icon: '🥛' },
    { value: 'other', label: 'Other', icon: '📦' },
  ];

  const units = ['servings', 'pieces', 'kg', 'lbs', 'liters', 'packages'];

  // ---------------- HELPERS ----------------
  const safeNumber = (val: string) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const calculateFreshness = () => {
    const base = Math.floor(Math.random() * 20) + 80;
    const expiryPenalty = Math.max(0, (safeNumber(formData.expiryHours) - 4) * -2);
    return Math.max(70, base + expiryPenalty);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setError(null);

    const quantity = safeNumber(formData.quantity);
    const expiryHours = safeNumber(formData.expiryHours);

    // Validation
    if (!formData.foodName.trim()) {
      return setError("Food name is required");
    }

    if (quantity <= 0) {
      return setError("Quantity must be greater than 0");
    }

    if (!formData.description.trim()) {
      return setError("Description is required");
    }

    if (expiryHours <= 0) {
      return setError("Invalid expiry time");
    }

    setIsSubmitting(true);

    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + expiryHours);

      const donationData: FoodDonationInput = {
        donor_id: user.id, // ✅ FIXED
        food_name: formData.foodName.trim(),
        food_type: formData.foodType,
        quantity,
        unit: formData.unit,
        description: formData.description.trim(),
        image_url: formData.imageUrl || undefined,
        freshness_score: calculateFreshness(),
        expiry_time: expiryTime.toISOString(),
        status: 'available',
        pickup_instructions: formData.pickupInstructions || undefined,
        dietary_info: formData.dietaryInfo.length ? formData.dietaryInfo : undefined,
        allergen_info: formData.allergenInfo.length ? formData.allergenInfo : undefined,
      };

      await addDonation(donationData);

      setShowSuccess(true);

      // Reset form
      setFormData({
        foodName: '',
        foodType: 'meals',
        quantity: '',
        unit: 'servings',
        description: '',
        expiryHours: '4',
        imageUrl: '',
        pickupInstructions: '',
        dietaryInfo: [],
        allergenInfo: [],
      });

      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      console.error(err);
      setError("Failed to add donation. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- SUCCESS UI ----------------
  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Food Added Successfully!</h2>
        <p className="text-gray-600 mt-2">Your donation is live for NGOs.</p>
      </div>
    );
  }

  // ---------------- FORM UI ----------------
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <UtensilsCrossed className="mr-2" /> Add Food Donation
      </h2>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* FOOD NAME */}
        <input
          type="text"
          placeholder="Food name"
          value={formData.foodName}
          onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* QUANTITY */}
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* EXPIRY */}
        <select
          value={formData.expiryHours}
          onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="2">2 hours</option>
          <option value="4">4 hours</option>
          <option value="8">8 hours</option>
          <option value="12">12 hours</option>
          <option value="24">24 hours</option>
        </select>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          {isSubmitting ? "Adding..." : "Add Donation"}
        </button>

        {/* LOCATION */}
        <div className="text-sm text-gray-500 flex items-center mt-2">
          <MapPin className="mr-1 w-4 h-4" />
          {profile?.address || "No address set"}
        </div>

      </form>
    </div>
  );
};

export default AddFoodForm;
