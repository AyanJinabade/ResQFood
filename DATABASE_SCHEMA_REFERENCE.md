# 📊 ResQFood Database Schema Reference

Complete reference for all tables, relationships, and data structures in the ResQFood platform.

## 🗂️ Table Structure Overview

```
ResQFood Database Schema
├── Core Tables
│   ├── profiles (User Management)
│   ├── food_donations (Food Listings)
│   ├── donation_requests (NGO Requests)
│   └── notifications (Real-time Alerts)
├── Support Tables
│   ├── feedback (Reviews & Ratings)
│   ├── chat_sessions (Support Chat)
│   └── support_tickets (Structured Support)
├── Analytics Tables
│   ├── analytics_events (User Behavior)
│   └── audit_logs (Security Tracking)
└── Configuration Tables
    └── platform_settings (App Configuration)
```

## 📋 Detailed Table Specifications

### 1. PROFILES Table
**Purpose**: User management with role-based access control

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, FK to auth.users | User identifier |
| `email` | TEXT | UNIQUE, NOT NULL | User email address |
| `name` | TEXT | NOT NULL | Full name or organization name |
| `phone` | TEXT | - | Contact phone number |
| `role` | user_role | NOT NULL, DEFAULT 'restaurant' | User role (restaurant/society/ngo/admin) |
| `organization_name` | TEXT | - | Official organization name |
| `organization_type` | TEXT | - | Type of organization |
| `address` | TEXT | - | Full street address |
| `city` | TEXT | - | City name |
| `state` | TEXT | - | State/province |
| `country` | TEXT | DEFAULT 'United States' | Country |
| `postal_code` | TEXT | - | ZIP/postal code |
| `latitude` | DECIMAL(10,8) | - | GPS latitude |
| `longitude` | DECIMAL(11,8) | - | GPS longitude |
| `verified` | BOOLEAN | DEFAULT FALSE | Account verification status |
| `verification_documents` | TEXT[] | - | Uploaded verification documents |
| `rating` | DECIMAL(3,2) | DEFAULT 0.00, CHECK (0-5) | Average user rating |
| `total_donations` | INTEGER | DEFAULT 0 | Total donations made |
| `total_collections` | INTEGER | DEFAULT 0 | Total collections made |
| `total_served` | INTEGER | DEFAULT 0 | Total people served |
| `profile_image_url` | TEXT | - | Profile picture URL |
| `bio` | TEXT | - | Organization description |
| `website_url` | TEXT | - | Organization website |
| `social_media` | JSONB | DEFAULT '{}' | Social media links |
| `operating_hours` | JSONB | DEFAULT '{}' | Business hours |
| `specialties` | TEXT[] | - | Food specialties/cuisines |
| `certifications` | TEXT[] | - | Food safety certifications |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account active status |
| `last_active_at` | TIMESTAMPTZ | DEFAULT NOW() | Last login time |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

### 2. FOOD_DONATIONS Table
**Purpose**: Core food donation listings with rich metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Donation identifier |
| `donor_id` | UUID | NOT NULL, FK to profiles | Donor user ID |
| `food_name` | TEXT | NOT NULL | Name of food item |
| `food_type` | food_type | NOT NULL | Category (meals/bakery/fruits/etc) |
| `cuisine_type` | TEXT | - | Cuisine style (Italian, Chinese, etc) |
| `quantity` | INTEGER | NOT NULL, CHECK > 0 | Amount available |
| `unit` | TEXT | NOT NULL, DEFAULT 'servings' | Unit of measurement |
| `description` | TEXT | NOT NULL | Detailed description |
| `ingredients` | TEXT[] | - | List of ingredients |
| `preparation_method` | TEXT | - | How food was prepared |
| `image_urls` | TEXT[] | - | Food photos |
| `freshness_score` | INTEGER | DEFAULT 90, CHECK (0-100) | AI-calculated freshness |
| `preparation_time` | TIMESTAMPTZ | - | When food was prepared |
| `expiry_time` | TIMESTAMPTZ | NOT NULL | When food expires |
| `best_before_time` | TIMESTAMPTZ | - | Optimal consumption time |
| `status` | donation_status | DEFAULT 'available' | Current status |
| `reserved_by` | UUID | FK to profiles | NGO that reserved it |
| `reserved_at` | TIMESTAMPTZ | - | Reservation timestamp |
| `collected_at` | TIMESTAMPTZ | - | Collection timestamp |
| `pickup_instructions` | TEXT | - | Special pickup instructions |
| `pickup_location` | TEXT | - | Specific pickup location |
| `pickup_contact` | TEXT | - | Contact for pickup |
| `dietary_info` | TEXT[] | DEFAULT '{}' | Dietary tags (vegan, etc) |
| `allergen_info` | TEXT[] | DEFAULT '{}' | Allergen information |
| `nutritional_info` | JSONB | DEFAULT '{}' | Nutritional data |
| `temperature_requirements` | TEXT | - | Storage temperature needs |
| `packaging_info` | TEXT | - | Packaging details |
| `serving_suggestions` | TEXT | - | How to serve |
| `storage_instructions` | TEXT | - | Storage requirements |
| `estimated_value` | DECIMAL(10,2) | - | Estimated monetary value |
| `tax_deduction_eligible` | BOOLEAN | DEFAULT FALSE | Tax deduction eligibility |
| `donation_receipt_url` | TEXT | - | Receipt document |
| `visibility` | TEXT | DEFAULT 'public' | Visibility level |
| `tags` | TEXT[] | DEFAULT '{}' | Custom tags |
| `priority_level` | INTEGER | DEFAULT 1, CHECK (1-5) | Urgency level |
| `auto_expire` | BOOLEAN | DEFAULT TRUE | Auto-expire when time reached |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation time |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

### 3. DONATION_REQUESTS Table
**Purpose**: NGO requests for food donations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Request identifier |
| `donation_id` | UUID | NOT NULL, FK to food_donations | Requested donation |
| `ngo_id` | UUID | NOT NULL, FK to profiles | Requesting NGO |
| `status` | request_status | DEFAULT 'pending' | Request status |
| `message` | TEXT | - | Request message |
| `requested_quantity` | INTEGER | - | Amount requested |
| `actual_quantity` | INTEGER | - | Amount actually received |
| `pickup_time` | TIMESTAMPTZ | - | Scheduled pickup time |
| `pickup_person_name` | TEXT | - | Person collecting food |
| `pickup_person_phone` | TEXT | - | Collector's phone |
| `pickup_person_id` | TEXT | - | Collector's ID number |
| `special_requirements` | TEXT | - | Special handling needs |
| `transportation_method` | TEXT | - | How food will be transported |
| `estimated_beneficiaries` | INTEGER | - | People who will benefit |
| `distribution_plan` | TEXT | - | How food will be distributed |
| `urgency_level` | INTEGER | DEFAULT 1, CHECK (1-5) | Request urgency |
| `internal_notes` | TEXT | - | NGO internal notes |
| `rejection_reason` | TEXT | - | Why request was rejected |
| `completion_notes` | TEXT | - | Notes after completion |
| `photos_urls` | TEXT[] | - | Photos of collected food |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Request creation time |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

### 4. NOTIFICATIONS Table
**Purpose**: Real-time notification system

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Notification identifier |
| `user_id` | UUID | NOT NULL, FK to profiles | Recipient user |
| `title` | TEXT | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification content |
| `type` | notification_type | DEFAULT 'info' | Notification type |
| `priority` | INTEGER | DEFAULT 1, CHECK (1-5) | Priority level |
| `read` | BOOLEAN | DEFAULT FALSE | Read status |
| `read_at` | TIMESTAMPTZ | - | When notification was read |
| `action_url` | TEXT | - | URL for action button |
| `action_label` | TEXT | - | Action button text |
| `data` | JSONB | DEFAULT '{}' | Additional data |
| `expires_at` | TIMESTAMPTZ | - | Expiration time |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation time |

### 5. FEEDBACK Table
**Purpose**: Reviews and ratings system

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Feedback identifier |
| `from_user_id` | UUID | NOT NULL, FK to profiles | Reviewer |
| `to_user_id` | UUID | NOT NULL, FK to profiles | Reviewee |
| `donation_id` | UUID | FK to food_donations | Related donation |
| `request_id` | UUID | FK to donation_requests | Related request |
| `overall_rating` | INTEGER | NOT NULL, CHECK (1-5) | Overall rating |
| `food_quality` | INTEGER | CHECK (1-5) | Food quality rating |
| `communication` | INTEGER | CHECK (1-5) | Communication rating |
| `timeliness` | INTEGER | CHECK (1-5) | Timeliness rating |
| `professionalism` | INTEGER | CHECK (1-5) | Professionalism rating |
| `comment` | TEXT | - | Written review |
| `photos_urls` | TEXT[] | - | Review photos |
| `would_recommend` | BOOLEAN | - | Recommendation status |
| `public_review` | BOOLEAN | DEFAULT TRUE | Public visibility |
| `response_from_recipient` | TEXT | - | Response to review |
| `response_at` | TIMESTAMPTZ | - | Response timestamp |
| `helpful_votes` | INTEGER | DEFAULT 0 | Helpful vote count |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Review creation time |

## 🔗 Relationships & Foreign Keys

### Primary Relationships
```sql
profiles (1) ←→ (many) food_donations
profiles (1) ←→ (many) donation_requests  
food_donations (1) ←→ (many) donation_requests
profiles (1) ←→ (many) notifications
profiles (1) ←→ (many) feedback (as reviewer)
profiles (1) ←→ (many) feedback (as reviewee)
```

### Key Constraints
- `donation_requests` has UNIQUE constraint on `(donation_id, ngo_id)`
- All foreign keys have CASCADE DELETE where appropriate
- CHECK constraints ensure data validity (ratings 1-5, quantities > 0, etc.)

## 🔐 Security Policies (RLS)

### Profile Access
- ✅ All users can view public profile information
- ✅ Users can only edit their own profiles
- ❌ Private information is restricted

### Food Donations Access
- ✅ Available donations visible to all
- ✅ Donors can manage their own donations
- ✅ NGOs can update reserved donations
- ✅ Admins have full access

### Request Access
- ✅ NGOs see their own requests
- ✅ Donors see requests for their donations
- ✅ Admins see all requests

### Notification Access
- ✅ Users only see their own notifications
- ✅ System can create notifications for any user

## 📊 Indexes for Performance

### Critical Indexes
```sql
-- Food donations
idx_food_donations_status (status)
idx_food_donations_available (status, expiry_time) WHERE status = 'available'
idx_food_donations_donor (donor_id)
idx_food_donations_expiry (expiry_time)

-- Profiles
idx_profiles_role (role)
idx_profiles_location (latitude, longitude)

-- Requests
idx_donation_requests_status (status)
idx_donation_requests_ngo (ngo_id)

-- Notifications
idx_notifications_user_read (user_id, read)
```

## 🔄 Automated Functions

### Key Functions
- `update_updated_at_column()` - Auto-update timestamps
- `expire_old_donations()` - Mark expired donations
- `create_notification()` - Generate notifications
- `handle_donation_request()` - Process request changes
- `generate_ticket_number()` - Create ticket numbers

### Triggers
- Update timestamps on record changes
- Create notifications for important events
- Update statistics when donations are completed
- Generate sequential ticket numbers

## 📈 Analytics Views

### donation_analytics
```sql
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_donations,
  COUNT(*) FILTER (WHERE status = 'collected') as collected_donations,
  AVG(freshness_score) as avg_freshness_score,
  SUM(quantity) FILTER (WHERE status = 'collected') as total_servings_rescued
FROM food_donations
GROUP BY DATE_TRUNC('day', created_at);
```

### user_statistics
```sql
SELECT 
  p.id, p.name, p.role,
  COUNT(fd.id) as active_donations,
  AVG(f.overall_rating) as avg_rating,
  COUNT(f.id) as total_reviews
FROM profiles p
LEFT JOIN food_donations fd ON p.id = fd.donor_id AND fd.status = 'available'
LEFT JOIN feedback f ON p.id = f.to_user_id
GROUP BY p.id, p.name, p.role;
```

## 🎯 Data Types Reference

### Custom Enums
```sql
user_role: 'restaurant' | 'society' | 'ngo' | 'admin'
donation_status: 'available' | 'reserved' | 'collected' | 'expired' | 'cancelled'
request_status: 'pending' | 'accepted' | 'rejected' | 'collected' | 'cancelled'
food_type: 'meals' | 'bakery' | 'fruits' | 'vegetables' | 'dairy' | 'beverages' | 'snacks' | 'other'
notification_type: 'info' | 'success' | 'warning' | 'error' | 'request' | 'status_update'
```

This comprehensive schema supports all ResQFood platform features with proper security, performance, and scalability! 🚀