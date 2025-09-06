import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  UtensilsCrossed, 
  Clock, 
  MapPin, 
  Camera, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AddFoodForm = () => {
  const { user } = useAuth();
  const { addDonation } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    foodName: '',
    foodType: 'meals' as 'meals' | 'bakery' | 'fruits' | 'vegetables' | 'dairy' | 'other',
    quantity: '',
    unit: 'servings',
    description: '',
    expiryHours: '4',
    imageUrl: ''
  });

  const foodTypes = [
    { value: 'meals', label: 'Prepared Meals', icon: '🍽️' },
    { value: 'bakery', label: 'Bakery Items', icon: '🍞' },
    { value: 'fruits', label: 'Fresh Fruits', icon: '🍎' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'dairy', label: 'Dairy Products', icon: '🥛' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  const units = [
    'servings', 'pieces', 'kg', 'lbs', 'liters', 'packages'
  ];

  // Simulate freshness score based on food type and expiry time
  const calculateFreshness = () => {
    const baseScore = Math.floor(Math.random() * 20) + 80; // 80-100
    const expiryPenalty = Math.max(0, (parseInt(formData.expiryHours) - 4) * -2);
    return Math.max(70, baseScore + expiryPenalty);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + parseInt(formData.expiryHours));

      await addDonation({
        userId: user.id,
        userName: user.name,
        foodName: formData.foodName,
        foodType: formData.foodType,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        description: formData.description,
        imageUrl: formData.imageUrl,
        freshnessScore: calculateFreshness(),
        expiryTime: expiryTime.toISOString(),
        status: 'available',
        location: user.location
      });

      setShowSuccess(true);
      setFormData({
        foodName: '',
        foodType: 'meals',
        quantity: '',
        unit: 'servings',
        description: '',
        expiryHours: '4',
        imageUrl: ''
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Added Successfully!</h2>
          <p className="text-gray-600 mb-6">Your food donation is now available for NGOs to request.</p>
          <button
            onClick={() => setShowSuccess(false)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            Add Another Food Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
          <UtensilsCrossed className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Add Food Donation</h2>
          <p className="text-gray-600">Share your surplus food with those in need</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Food Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Food Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {foodTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, foodType: type.value as any })}
                className={`p-4 rounded-lg border text-center transition-all ${
                  formData.foodType === type.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-medium text-sm">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Food Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
              Food Item Name *
            </label>
            <input
              id="foodName"
              type="text"
              value={formData.foodName}
              onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g., Vegetable Biryani, Fresh Bread"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="50"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Describe the food, ingredients, preparation method, any allergens, etc."
            required
          />
        </div>

        {/* Expiry Time */}
        <div>
          <label htmlFor="expiryHours" className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="w-4 h-4 inline mr-2" />
            Best Before (Hours from now)
          </label>
          <select
            id="expiryHours"
            value={formData.expiryHours}
            onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="2">2 hours</option>
            <option value="4">4 hours</option>
            <option value="8">8 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            Choose realistic timeframe to maintain food quality
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Camera className="w-4 h-4 inline mr-2" />
            Food Image (Optional)
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Paste image URL or upload later"
          />
          <p className="text-sm text-gray-500 mt-1">
            High-quality images help NGOs better assess the food
          </p>
        </div>

        {/* Location Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Pickup Location: {user?.location.address}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This location will be shared with NGOs upon request acceptance
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Adding Food...
            </>
          ) : (
            <>
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              Add Food Donation
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddFoodForm;
