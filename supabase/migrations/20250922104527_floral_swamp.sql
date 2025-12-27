/*
  # Complete ResQFood Database Schema
  
  This migration creates the complete database structure for ResQFood platform
  including all tables, relationships, security policies, and sample data.
  
  ## Tables Created:
  1. profiles - User profiles with role-based information
  2. food_donations - Food donation listings with complete details
  3. donation_requests - NGO requests for food donations
  4. notifications - Real-time notification system
  5. feedback - User ratings and reviews
  6. chat_sessions - Chat support sessions
  7. support_tickets - Support ticket management
  8. analytics_events - Platform analytics tracking
  
  ## Security:
  - Row Level Security enabled on all tables
  - Role-based access policies
  - Secure data access patterns
  
  ## Features:
  - Real-time subscriptions
  - Automatic triggers for notifications
  - Data validation and constraints
  - Performance optimized indexes
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" CASCADE;

-- Create custom types
CREATE TYPE user_role AS ENUM ('restaurant', 'society', 'ngo', 'admin');
CREATE TYPE donation_status AS ENUM ('available', 'reserved', 'collected', 'expired', 'cancelled');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'collected', 'cancelled');
CREATE TYPE food_type AS ENUM ('meals', 'bakery', 'fruits', 'vegetables', 'dairy', 'beverages', 'snacks', 'other');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'request', 'status_update');
CREATE TYPE chat_session_status AS ENUM ('active', 'waiting', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- 1. PROFILES TABLE (User Management)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'restaurant',
  organization_name TEXT,
  organization_type TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'United States',
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  verified BOOLEAN DEFAULT FALSE,
  verification_documents TEXT[],
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  total_donations INTEGER DEFAULT 0,
  total_collections INTEGER DEFAULT 0,
  total_served INTEGER DEFAULT 0,
  profile_image_url TEXT,
  bio TEXT,
  website_url TEXT,
  social_media JSONB DEFAULT '{}',
  operating_hours JSONB DEFAULT '{}',
  specialties TEXT[],
  certifications TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FOOD DONATIONS TABLE (Core Functionality)
CREATE TABLE IF NOT EXISTS food_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  food_type food_type NOT NULL,
  cuisine_type TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL DEFAULT 'servings',
  description TEXT NOT NULL,
  ingredients TEXT[],
  preparation_method TEXT,
  image_urls TEXT[],
  freshness_score INTEGER DEFAULT 90 CHECK (freshness_score >= 0 AND freshness_score <= 100),
  preparation_time TIMESTAMPTZ,
  expiry_time TIMESTAMPTZ NOT NULL,
  best_before_time TIMESTAMPTZ,
  status donation_status DEFAULT 'available',
  reserved_by UUID REFERENCES profiles(id),
  reserved_at TIMESTAMPTZ,
  collected_at TIMESTAMPTZ,
  pickup_instructions TEXT,
  pickup_location TEXT,
  pickup_contact TEXT,
  dietary_info TEXT[] DEFAULT '{}', -- vegetarian, vegan, gluten-free, etc.
  allergen_info TEXT[] DEFAULT '{}', -- nuts, dairy, eggs, etc.
  nutritional_info JSONB DEFAULT '{}',
  temperature_requirements TEXT, -- hot, cold, room temperature
  packaging_info TEXT,
  serving_suggestions TEXT,
  storage_instructions TEXT,
  estimated_value DECIMAL(10, 2),
  tax_deduction_eligible BOOLEAN DEFAULT FALSE,
  donation_receipt_url TEXT,
  visibility TEXT DEFAULT 'public', -- public, private, restricted
  tags TEXT[] DEFAULT '{}',
  priority_level INTEGER DEFAULT 1 CHECK (priority_level >= 1 AND priority_level <= 5),
  auto_expire BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DONATION REQUESTS TABLE (NGO Requests)
CREATE TABLE IF NOT EXISTS donation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL REFERENCES food_donations(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status request_status DEFAULT 'pending',
  message TEXT,
  requested_quantity INTEGER,
  actual_quantity INTEGER,
  pickup_time TIMESTAMPTZ,
  pickup_person_name TEXT,
  pickup_person_phone TEXT,
  pickup_person_id TEXT,
  special_requirements TEXT,
  transportation_method TEXT,
  estimated_beneficiaries INTEGER,
  distribution_plan TEXT,
  urgency_level INTEGER DEFAULT 1 CHECK (urgency_level >= 1 AND urgency_level <= 5),
  internal_notes TEXT,
  rejection_reason TEXT,
  completion_notes TEXT,
  photos_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(donation_id, ngo_id)
);

-- 4. NOTIFICATIONS TABLE (Real-time Updates)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'info',
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  action_url TEXT,
  action_label TEXT,
  data JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FEEDBACK TABLE (Reviews and Ratings)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  donation_id UUID REFERENCES food_donations(id) ON DELETE CASCADE,
  request_id UUID REFERENCES donation_requests(id) ON DELETE CASCADE,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  food_quality INTEGER CHECK (food_quality >= 1 AND food_quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  timeliness INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  comment TEXT,
  photos_urls TEXT[],
  would_recommend BOOLEAN,
  public_review BOOLEAN DEFAULT TRUE,
  response_from_recipient TEXT,
  response_at TIMESTAMPTZ,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CHAT SESSIONS TABLE (Support System)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT DEFAULT 'support', -- support, feedback, general
  status chat_session_status DEFAULT 'active',
  priority ticket_priority DEFAULT 'medium',
  category TEXT,
  subject TEXT,
  assigned_agent_id UUID REFERENCES profiles(id),
  messages JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  resolution_time INTEGER, -- in minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- 7. SUPPORT TICKETS TABLE (Structured Support)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority ticket_priority DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  assigned_agent_id UUID REFERENCES profiles(id),
  tags TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  resolution TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  estimated_resolution_time INTEGER, -- in hours
  actual_resolution_time INTEGER, -- in hours
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 8. ANALYTICS EVENTS TABLE (Platform Analytics)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PLATFORM SETTINGS TABLE (Configuration)
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDIT LOGS TABLE (Security and Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- FOOD DONATIONS POLICIES
CREATE POLICY "Available donations are viewable by everyone" ON food_donations
  FOR SELECT USING (
    status = 'available' OR 
    donor_id = auth.uid() OR 
    reserved_by = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Donors can insert donations" ON food_donations
  FOR INSERT WITH CHECK (
    donor_id = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('restaurant', 'society'))
  );

CREATE POLICY "Donors can update own donations" ON food_donations
  FOR UPDATE USING (donor_id = auth.uid());

CREATE POLICY "NGOs can update reserved donations" ON food_donations
  FOR UPDATE USING (
    reserved_by = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ngo')
  );

-- DONATION REQUESTS POLICIES
CREATE POLICY "Users can view related requests" ON donation_requests
  FOR SELECT USING (
    ngo_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM food_donations WHERE id = donation_id AND donor_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "NGOs can create requests" ON donation_requests
  FOR INSERT WITH CHECK (
    ngo_id = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ngo')
  );

CREATE POLICY "Users can update related requests" ON donation_requests
  FOR UPDATE USING (
    ngo_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM food_donations WHERE id = donation_id AND donor_id = auth.uid())
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- FEEDBACK POLICIES
CREATE POLICY "Users can view feedback" ON feedback
  FOR SELECT USING (
    from_user_id = auth.uid() OR 
    to_user_id = auth.uid() OR
    public_review = true
  );

CREATE POLICY "Users can create feedback" ON feedback
  FOR INSERT WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Users can update own feedback" ON feedback
  FOR UPDATE USING (from_user_id = auth.uid());

-- CHAT SESSIONS POLICIES
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (
    user_id = auth.uid() OR 
    assigned_agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    assigned_agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- SUPPORT TICKETS POLICIES
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (
    user_id = auth.uid() OR 
    assigned_agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tickets" ON support_tickets
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    assigned_agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ANALYTICS POLICIES
CREATE POLICY "Users can view own analytics" ON analytics_events
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- PLATFORM SETTINGS POLICIES
CREATE POLICY "Public settings are viewable by everyone" ON platform_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage settings" ON platform_settings
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- AUDIT LOGS POLICIES
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(verified);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_food_donations_status ON food_donations(status);
CREATE INDEX IF NOT EXISTS idx_food_donations_donor ON food_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_food_donations_expiry ON food_donations(expiry_time);
CREATE INDEX IF NOT EXISTS idx_food_donations_type ON food_donations(food_type);
CREATE INDEX IF NOT EXISTS idx_food_donations_available ON food_donations(status, expiry_time) WHERE status = 'available';

CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_donation_requests_ngo ON donation_requests(ngo_id);
CREATE INDEX IF NOT EXISTS idx_donation_requests_donation ON donation_requests(donation_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_feedback_to_user ON feedback(to_user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_from_user ON feedback(from_user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_donation ON feedback(donation_id);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_number ON support_tickets(ticket_number);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);

-- CREATE FUNCTIONS FOR AUTOMATION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- CREATE TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_donations_updated_at BEFORE UPDATE ON food_donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_requests_updated_at BEFORE UPDATE ON donation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON platform_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FUNCTION TO EXPIRE OLD DONATIONS
CREATE OR REPLACE FUNCTION expire_old_donations()
RETURNS void AS $$
BEGIN
  UPDATE food_donations 
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'available' 
    AND expiry_time < NOW();
END;
$$ LANGUAGE plpgsql;

-- FUNCTION TO CREATE NOTIFICATIONS
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'info',
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

-- FUNCTION TO HANDLE DONATION REQUESTS
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

-- CREATE TRIGGER FOR DONATION REQUESTS
CREATE TRIGGER donation_request_trigger
  AFTER INSERT OR UPDATE ON donation_requests
  FOR EACH ROW EXECUTE FUNCTION handle_donation_request();

-- FUNCTION TO GENERATE TICKET NUMBERS
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number = 'RQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('ticket_sequence')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE SEQUENCE FOR TICKET NUMBERS
CREATE SEQUENCE IF NOT EXISTS ticket_sequence START 1;

-- CREATE TRIGGER FOR TICKET NUMBERS
CREATE TRIGGER generate_ticket_number_trigger
  BEFORE INSERT ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- INSERT SAMPLE DATA FOR TESTING
INSERT INTO profiles (id, email, name, phone, role, organization_name, address, city, state, latitude, longitude, verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'restaurant@demo.com', 'Green Garden Restaurant', '+1234567890', 'restaurant', 'Green Garden Restaurant', '123 Main St', 'New York', 'NY', 40.7128, -74.0060, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'ngo@demo.com', 'Helping Hands NGO', '+1234567891', 'ngo', 'Helping Hands NGO', '456 Helper Ave', 'New York', 'NY', 40.7589, -73.9851, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'society@demo.com', 'Sunset Society', '+1234567892', 'society', 'Sunset Society', '789 Community Rd', 'New York', 'NY', 40.7505, -73.9934, true),
  ('550e8400-e29b-41d4-a716-446655440004', 'admin@demo.com', 'System Admin', '+1234567893', 'admin', 'ResQFood Admin', 'Admin Office', 'New York', 'NY', 40.7420, -74.0020, true);

-- INSERT SAMPLE FOOD DONATIONS
INSERT INTO food_donations (donor_id, food_name, food_type, quantity, unit, description, freshness_score, expiry_time, pickup_instructions, dietary_info, allergen_info) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Fresh Vegetable Curry', 'meals', 50, 'servings', 'Healthy mixed vegetable curry with rice, freshly prepared', 92, NOW() + INTERVAL '4 hours', 'Please bring containers. Available for pickup between 6-8 PM.', ARRAY['vegetarian', 'gluten-free'], ARRAY['none']),
  ('550e8400-e29b-41d4-a716-446655440003', 'Assorted Bread & Pastries', 'bakery', 30, 'pieces', 'Fresh bread rolls and pastries from morning event', 88, NOW() + INTERVAL '12 hours', 'Located at main entrance. Ring bell for pickup.', ARRAY['vegetarian'], ARRAY['gluten', 'eggs']),
  ('550e8400-e29b-41d4-a716-446655440001', 'Fresh Fruit Salad', 'fruits', 25, 'portions', 'Mixed seasonal fruit salad, perfect for distribution', 95, NOW() + INTERVAL '8 hours', 'Refrigerated pickup required. Available 9 AM - 5 PM.', ARRAY['vegan', 'gluten-free'], ARRAY['none']);

-- INSERT PLATFORM SETTINGS
INSERT INTO platform_settings (key, value, description, category, is_public) VALUES
  ('app_name', '"ResQFood"', 'Application name', 'general', true),
  ('app_version', '"1.0.0"', 'Application version', 'general', true),
  ('max_donation_expiry_hours', '72', 'Maximum hours for donation expiry', 'donations', false),
  ('min_freshness_score', '70', 'Minimum freshness score for donations', 'donations', false),
  ('notification_retention_days', '30', 'Days to keep notifications', 'notifications', false),
  ('support_email', '"support@resqfood.com"', 'Support email address', 'support', true),
  ('emergency_phone', '"+1-800-RESQFOOD"', 'Emergency support phone', 'support', true);

-- CREATE VIEW FOR ANALYTICS
CREATE OR REPLACE VIEW donation_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_donations,
  COUNT(*) FILTER (WHERE status = 'collected') as collected_donations,
  COUNT(*) FILTER (WHERE status = 'expired') as expired_donations,
  AVG(freshness_score) as avg_freshness_score,
  SUM(quantity) FILTER (WHERE status = 'collected') as total_servings_rescued
FROM food_donations
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- CREATE VIEW FOR USER STATISTICS
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  p.id,
  p.name,
  p.role,
  p.total_donations,
  p.total_collections,
  COUNT(fd.id) as active_donations,
  AVG(f.overall_rating) as avg_rating,
  COUNT(f.id) as total_reviews
FROM profiles p
LEFT JOIN food_donations fd ON p.id = fd.donor_id AND fd.status = 'available'
LEFT JOIN feedback f ON p.id = f.to_user_id
GROUP BY p.id, p.name, p.role, p.total_donations, p.total_collections;

-- ENABLE REAL-TIME FOR TABLES
ALTER PUBLICATION supabase_realtime ADD TABLE food_donations;
ALTER PUBLICATION supabase_realtime ADD TABLE donation_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;

-- FINAL COMMENT
COMMENT ON SCHEMA public IS 'ResQFood Database Schema - Complete food donation platform with real-time features, security, and analytics';