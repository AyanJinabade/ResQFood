export type Role = 'restaurant' | 'society' | 'ngo' | 'admin';

export type DonationStatus =
  | 'available'
  | 'reserved'
  | 'collected'
  | 'expired';

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'collected';

export type FoodType =
  | 'meals'
  | 'bakery'
  | 'fruits'
  | 'vegetables'
  | 'dairy'
  | 'other';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  location: Location;
  verified: boolean;
  createdAt: string;
}

export interface FoodDonation {
  id: string;

  userId: string;
  userName: string;

  foodName: string;
  foodType: FoodType;
  quantity: number;
  unit: string;
  description?: string;
  imageUrl?: string;

  freshnessScore?: number;
  createdAt: string;
  expiryTime?: string;
  status: DonationStatus;
  location: Location;

  reservedBy?: string;
  collectedAt?: string;

  donor_id?: string;
  freshness_score?: number;
}
export interface NGORequest {
  id: string;
  ngoId: string;
  ngoName: string;
  donationId: string;
  status: RequestStatus;
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
  comment?: string;

  createdAt: string;
}
export interface AdminStats {
  totalUsers: number;
  totalDonations: number;
  activeDonations: number;
  totalServed: number;

  usersByRole: Record<Role, number>;
  donationsByType: Record<FoodType, number>;

  monthlyDonations: Array<{
    month: string;
    count: number;
  }>;
}
