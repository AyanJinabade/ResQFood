/*
  # ResQFood Database Schema

  1. New Tables
    - `profiles` - User profiles with role-based access
    - `food_donations` - Food donation listings
    - `donation_requests` - NGO requests for food donations
    - `notifications` - Real-time notifications
    - `feedback` - User feedback and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles

  3. Real-time Features
    - Enable real-time subscriptions for donations
    - Live updates for requests and notifications
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('restaurant', 'society', 'ngo', 'admin');
CREATE TYPE donation_status AS ENUM ('available', 'reserved', 'collected', 'expired', 'cancelled');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'collected');
CREATE TYPE food_type AS ENUM ('meals', 'bakery', 'fruits', 'vegetables', 'dairy', 'other');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'restaurant',
  organization_name TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_donations INTEGER DEFAULT 0,
  total_collections INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food donations table
CREATE TABLE IF NOT EXISTS food_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  food_type food_type NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL DEFAULT 'servings',
  description TEXT NOT NULL,
  image_url TEXT,
  freshness_score INTEGER DEFAULT 90 CHECK (freshness_score >= 0 AND freshness_score <= 100),
  expiry_time TIMESTAMPTZ NOT NULL,
  status donation_status DEFAULT 'available',
  reserved_by UUID REFERENCES profiles(id),
  reserved_at TIMESTAMPTZ,
  collected_at TIMESTAMPTZ,
  pickup_instructions TEXT,
  dietary_info TEXT[],
  allergen_info TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donation requests table
CREATE TABLE IF NOT EXISTS donation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL REFERENCES food_donations(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status request_status DEFAULT 'pending',
  message TEXT,
  requested_quantity INTEGER,
  pickup_time TIMESTAMPTZ,
  special_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(donation_id, ngo_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  donation_id UUID REFERENCES food_donations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  food_quality INTEGER CHECK (food_quality >= 1 AND food_quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  timeliness INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Food donations policies
CREATE POLICY "Anyone can view available donations" ON food_donations FOR SELECT USING (
  status = 'available' OR donor_id = auth.uid() OR reserved_by = auth.uid()
);
CREATE POLICY "Donors can insert donations" ON food_donations FOR INSERT WITH CHECK (
  donor_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('restaurant', 'society'))
);
CREATE POLICY "Donors can update own donations" ON food_donations FOR UPDATE USING (
  donor_id = auth.uid()
);
CREATE POLICY "NGOs can update reserved donations" ON food_donations FOR UPDATE USING (
  reserved_by = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ngo')
);

-- Donation requests policies
CREATE POLICY "Users can view related requests" ON donation_requests FOR SELECT USING (
  ngo_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM food_donations WHERE id = donation_id AND donor_id = auth.uid())
);
CREATE POLICY "NGOs can create requests" ON donation_requests FOR INSERT WITH CHECK (
  ngo_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ngo')
);
CREATE POLICY "Users can update related requests" ON donation_requests FOR UPDATE USING (
  ngo_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM food_donations WHERE id = donation_id AND donor_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Feedback policies
CREATE POLICY "Users can view feedback" ON feedback FOR SELECT USING (
  from_user_id = auth.uid() OR to_user_id = auth.uid()
);
CREATE POLICY "Users can create feedback" ON feedback FOR INSERT WITH CHECK (from_user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_donations_status ON food_donations(status);
CREATE INDEX IF NOT EXISTS idx_food_donations_donor ON food_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_food_donations_expiry ON food_donations(expiry_time);
CREATE INDEX IF NOT EXISTS idx_food_donations_location ON food_donations(donor_id) WHERE status = 'available';
CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_donation_requests_ngo ON donation_requests(ngo_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_donations_updated_at BEFORE UPDATE ON food_donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_requests_updated_at BEFORE UPDATE ON donation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically expire donations
CREATE OR REPLACE FUNCTION expire_old_donations()
RETURNS void AS $$
BEGIN
  UPDATE food_donations 
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'available' 
    AND expiry_time < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, title, message, type, data)
  VALUES (p_user_id, p_title, p_message, p_type, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to handle donation request
CREATE OR REPLACE FUNCTION handle_donation_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify donor about new request
  IF TG_OP = 'INSERT' THEN
    PERFORM create_notification(
      (SELECT donor_id FROM food_donations WHERE id = NEW.donation_id),
      'New Food Request',
      'An NGO has requested your food donation: ' || (SELECT food_name FROM food_donations WHERE id = NEW.donation_id),
      'request',
      jsonb_build_object('donation_id', NEW.donation_id, 'request_id', NEW.id)
    );
  END IF;
  
  -- Handle request status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    -- Notify NGO about status change
    PERFORM create_notification(
      NEW.ngo_id,
      'Request Status Updated',
      'Your request has been ' || NEW.status,
      'status_update',
      jsonb_build_object('donation_id', NEW.donation_id, 'request_id', NEW.id, 'status', NEW.status)
    );
    
    -- If accepted, reserve the donation
    IF NEW.status = 'accepted' THEN
      UPDATE food_donations 
      SET status = 'reserved', reserved_by = NEW.ngo_id, reserved_at = NOW()
      WHERE id = NEW.donation_id;
    END IF;
    
    -- If collected, mark donation as collected
    IF NEW.status = 'collected' THEN
      UPDATE food_donations 
      SET status = 'collected', collected_at = NOW()
      WHERE id = NEW.donation_id;
      
      -- Update user stats
      UPDATE profiles SET total_donations = total_donations + 1
      WHERE id = (SELECT donor_id FROM food_donations WHERE id = NEW.donation_id);
      
      UPDATE profiles SET total_collections = total_collections + 1
      WHERE id = NEW.ngo_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for donation requests
CREATE TRIGGER donation_request_trigger
  AFTER INSERT OR UPDATE ON donation_requests
  FOR EACH ROW EXECUTE FUNCTION handle_donation_request();

-- Insert sample data for testing
INSERT INTO profiles (id, email, name, phone, role, organization_name, address, latitude, longitude, verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'restaurant@demo.com', 'Green Garden Restaurant', '+1234567890', 'restaurant', 'Green Garden Restaurant', '123 Main St, New York, NY', 40.7128, -74.0060, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'ngo@demo.com', 'Helping Hands NGO', '+1234567891', 'ngo', 'Helping Hands NGO', '456 Helper Ave, New York, NY', 40.7589, -73.9851, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'society@demo.com', 'Sunset Society', '+1234567892', 'society', 'Sunset Society', '789 Community Rd, New York, NY', 40.7505, -73.9934, true),
  ('550e8400-e29b-41d4-a716-446655440004', 'admin@demo.com', 'System Admin', '+1234567893', 'admin', 'ResQFood Admin', 'Admin Office, New York, NY', 40.7420, -74.0020, true);

-- Insert sample food donations
INSERT INTO food_donations (donor_id, food_name, food_type, quantity, unit, description, freshness_score, expiry_time, pickup_instructions) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Fresh Vegetable Curry', 'meals', 50, 'servings', 'Healthy mixed vegetable curry with rice, freshly prepared', 92, NOW() + INTERVAL '4 hours', 'Please bring containers. Available for pickup between 6-8 PM.'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Assorted Bread & Pastries', 'bakery', 30, 'pieces', 'Fresh bread rolls and pastries from morning event', 88, NOW() + INTERVAL '12 hours', 'Located at main entrance. Ring bell for pickup.');