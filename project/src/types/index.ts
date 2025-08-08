export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'restaurant' | 'society' | 'ngo' | 'admin';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  verified: boolean;
  createdAt: string;
}

export interface FoodDonation {
  id: string;
  userId: string;
  userName: string;
  foodName: string;
  foodType: 'meals' | 'bakery' | 'fruits' | 'vegetables' | 'dairy' | 'other';
  quantity: number;
  unit: string;
  description: string;
  imageUrl?: string;
  freshnessScore: number;
  createdAt: string;
  expiryTime: string;
  status: 'available' | 'reserved' | 'collected' | 'expired';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reservedBy?: string;
  collectedAt?: string;
}

export interface NGORequest {
  id: string;
  ngoId: string;
  ngoName: string;
  donationId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'collected';
  requestedAt: string;
  message?: string;
  feedback?: {
    rating: number;
    comment: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    served: number;
  };
}

export interface Feedback {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  donationId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDonations: number;
  activeDonations: number;
  totalServed: number;
  usersByRole: Record<string, number>;
  donationsByType: Record<string, number>;
  monthlyDonations: Array<{ month: string; count: number }>;
}