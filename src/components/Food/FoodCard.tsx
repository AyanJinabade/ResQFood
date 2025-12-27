import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  MapPin, 
  User, 
  Heart, 
  Star,
  Trash2,
  Edit3,
  Eye
} from 'lucide-react';
import { FoodDonation } from '../../lib/supabase';

interface FoodCardProps {
  donation: FoodDonation;
  showActions?: boolean;
}

const FoodCard = ({ donation, showActions = true }: FoodCardProps) => {
  const { user, profile } = useAuth();
  const { removeDonation, addRequest } = useApp();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const isOwner = user?.id === donation.donor_id;
  const canRequest = profile?.role === 'ngo' && donation.status === 'available' && !isOwner;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'collected':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFreshnessColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(donation.expiry_time);
    const diffInMinutes = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Expired';
    if (diffInMinutes < 60) return `${diffInMinutes}m left`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h left`;
    return `${Math.floor(diffInMinutes / 1440)}d left`;
  };

  const handleRequest = async () => {
    if (!user || !profile) return;
    
    setIsRequesting(true);
    try {
      const requestData = {
        ngo_id: user.id,
        donation_id: donation.id,
        status: 'pending' as const,
        message: `Request from ${profile.name}`,
        requested_quantity: donation.quantity
      };
      
      await addRequest(requestData);
    } catch (error) {
      console.error('Failed to request food:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      await removeDonation(donation.id);
    }
  };

  const foodTypeEmojis = {
    meals: '🍽️',
    bakery: '🍞',
    fruits: '🍎',
    vegetables: '🥬',
    dairy: '🥛',
    other: '📦'
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{foodTypeEmojis[donation.food_type]}</div>
            <div>
              <h3 className="font-semibold text-gray-900">{donation.food_name}</h3>
              <p className="text-sm text-gray-500 capitalize">{donation.food_type}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
            {donation.status}
          </span>
        </div>

        {/* Image */}
        {donation.image_url && (
          <div className="mb-4">
            <img
              src={donation.image_url}
              alt={donation.food_name}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{donation.donor?.name || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className={`w-4 h-4 ${getFreshnessColor(donation.freshness_score)}`} />
              <span className={`text-sm font-medium ${getFreshnessColor(donation.freshness_score)}`}>
                {donation.freshness_score}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {donation.quantity} {donation.unit}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{getTimeRemaining()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{donation.donor?.address || 'Address not available'}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{donation.description}</p>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center space-x-2">
            {canRequest && (
              <button
                onClick={handleRequest}
                disabled={isRequesting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isRequesting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Heart className="w-4 h-4 mr-2" />
                )}
                {isRequesting ? 'Requesting...' : 'Request Food'}
              </button>
            )}

            {profile?.role === 'ngo' && !canRequest && (
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            )}

            {isOwner && donation.status === 'available' && (
              <>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {profile?.role === 'admin' && (
              <button
                onClick={() => setShowDetails(true)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Food Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <FoodCard donation={donation} showActions={false} />
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Full Description</h3>
                <p className="text-gray-600">{donation.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodCard;