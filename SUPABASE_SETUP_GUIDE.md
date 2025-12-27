# 🚀 Complete Supabase Setup Guide for ResQFood

This guide will help you set up your Supabase database for the ResQFood platform with all required tables, security policies, and features.

## 📋 Prerequisites

1. **Supabase Account**: Create account at [supabase.com](https://supabase.com)
2. **New Project**: Create a new Supabase project
3. **Environment Variables**: Get your project URL and anon key

## 🗄️ Database Tables Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User management | Role-based access, location data, ratings |
| `food_donations` | Food listings | Real-time updates, expiry tracking, rich metadata |
| `donation_requests` | NGO requests | Status tracking, pickup coordination |
| `notifications` | Real-time alerts | Priority levels, action buttons |
| `feedback` | Reviews/ratings | Multi-criteria ratings, public reviews |
| `chat_sessions` | Support chat | Real-time messaging, agent assignment |
| `support_tickets` | Structured support | Ticket tracking, priority management |
| `analytics_events` | Platform analytics | User behavior, performance metrics |
| `platform_settings` | Configuration | App settings, feature flags |
| `audit_logs` | Security tracking | Action logging, compliance |

## 🔧 Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and enter project details
4. Wait for project to be ready (2-3 minutes)

### Step 2: Run Database Migration
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the entire content from `supabase/migrations/create_complete_resqfood_schema.sql`
4. Paste into SQL Editor
5. Click **Run** to execute the migration

### Step 3: Configure Environment Variables
Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Enable Real-time (Optional)
1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - `food_donations`
   - `donation_requests`
   - `notifications`
   - `chat_sessions`

### Step 5: Configure Authentication
1. Go to **Authentication** → **Settings**
2. Configure email templates (optional)
3. Set up social providers (optional)
4. Configure redirect URLs for your domain

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with role-based policies:

- **Restaurants/Societies**: Can manage their own donations
- **NGOs**: Can view available food and manage their requests
- **Admins**: Full access to all data
- **Users**: Can only access their own data

### Data Validation
- Input validation with CHECK constraints
- Required fields enforcement
- Data type validation
- Foreign key relationships

### Audit Trail
- All important actions are logged
- User activity tracking
- Security event monitoring

## 📊 Key Features

### Real-time Updates
- New donations appear instantly for NGOs
- Request status changes notify all parties
- Live notifications and chat messages
- Dashboard updates automatically

### Smart Automation
- Automatic donation expiry
- Notification generation
- Statistics calculation
- Ticket number generation

### Analytics & Reporting
- User activity tracking
- Donation success rates
- Platform usage metrics
- Performance monitoring

## 🎯 User Roles & Permissions

### Restaurant/Society
- ✅ Create and manage food donations
- ✅ View and respond to NGO requests
- ✅ Access own analytics and feedback
- ❌ Cannot see other restaurants' data

### NGO
- ✅ Browse available food donations
- ✅ Make requests for food items
- ✅ Manage pickup and collection
- ✅ Provide feedback and ratings
- ❌ Cannot see internal restaurant data

### Admin
- ✅ Full platform oversight
- ✅ User management and verification
- ✅ System analytics and reporting
- ✅ Support ticket management
- ✅ Platform configuration

## 🔄 Real-time Subscriptions

Enable real-time features in your app:

```javascript
// Subscribe to new donations
supabase
  .channel('food_donations')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'food_donations' }, 
    (payload) => {
      // Handle new donation
    }
  )
  .subscribe()

// Subscribe to request updates
supabase
  .channel('donation_requests')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'donation_requests' }, 
    (payload) => {
      // Handle request status change
    }
  )
  .subscribe()
```

## 📱 Sample Data

The migration includes sample data for testing:

### Demo Accounts
- **Restaurant**: restaurant@demo.com / demo123
- **NGO**: ngo@demo.com / demo123  
- **Society**: society@demo.com / demo123
- **Admin**: admin@demo.com / demo123

### Sample Donations
- Fresh Vegetable Curry (50 servings)
- Assorted Bread & Pastries (30 pieces)
- Fresh Fruit Salad (25 portions)

## 🚀 Production Checklist

Before going live:

- [ ] Remove or update sample data
- [ ] Configure proper email templates
- [ ] Set up monitoring and alerts
- [ ] Configure backup policies
- [ ] Review and test all RLS policies
- [ ] Set up proper domain and SSL
- [ ] Configure rate limiting
- [ ] Test all user flows
- [ ] Set up error tracking
- [ ] Configure analytics

## 🆘 Troubleshooting

### Common Issues

**Migration Fails**
- Check for syntax errors in SQL
- Ensure you have proper permissions
- Try running sections separately

**RLS Blocks Access**
- Verify user authentication
- Check policy conditions
- Test with different user roles

**Real-time Not Working**
- Enable replication for tables
- Check subscription code
- Verify network connectivity

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [SQL Reference](https://supabase.com/docs/guides/database)
- [Real-time Guide](https://supabase.com/docs/guides/realtime)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 📈 Monitoring & Maintenance

### Regular Tasks
- Monitor database performance
- Review and clean old notifications
- Update analytics views
- Check for expired donations
- Review user feedback

### Performance Optimization
- Monitor query performance
- Add indexes as needed
- Optimize real-time subscriptions
- Review and update RLS policies

---

Your ResQFood database is now ready for production! 🎉

The platform includes everything needed for a complete food donation system with real-time updates, security, and scalability.