<<<<<<< HEAD
# ResQFood - Food Donation Platform with Supabase

A comprehensive food donation platform that connects restaurants, societies, and NGOs to reduce food waste and help those in need.

## Features

### Real-time Food Donation System
- **Restaurant/Society Dashboard** - Add, manage, and track food donations
- **NGO Platform** - Browse available food and make requests
- **Admin Panel** - Monitor platform activity and analytics
- **Real-time Updates** - Live notifications and status updates

### Advanced Functionality
- **Role-based Access Control** - Different interfaces for different user types
- **Smart Matching** - Location-based food discovery
- **Request Management** - Complete workflow from request to collection
- **Feedback System** - Rating and review system for quality assurance
- **Analytics Dashboard** - Comprehensive insights and reporting

### Technical Features
- **Supabase Integration** - Real-time database with PostgreSQL
- **Row Level Security** - Secure data access based on user roles
- **Real-time Subscriptions** - Live updates across the platform
- **Responsive Design** - Works perfectly on all devices
- **TypeScript** - Full type safety throughout the application

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time, Auth)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify/Vercel

##  Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resqfood
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```
   - Add your Supabase credentials to `.env`

4. **Run database migrations**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and run the SQL from `supabase/migrations/create_resqfood_schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

##  Database Schema

### Core Tables
- **profiles** - User profiles with role-based information
- **food_donations** - Food donation listings with details
- **donation_requests** - NGO requests for food donations
- **notifications** - Real-time notification system
- **feedback** - User ratings and reviews

### Key Features
- **Row Level Security (RLS)** - Secure access control
- **Real-time subscriptions** - Live updates
- **Automatic triggers** - Status updates and notifications
- **Performance indexes** - Optimized queries

##  User Roles

### Restaurant/Society
- Add food donations with details
- Manage donation requests from NGOs
- Track donation history and impact
- Receive feedback and ratings

### NGO
- Browse available food donations
- Make requests for needed items
- Coordinate pickup and collection
- Provide feedback on food quality

### Admin
- Monitor platform activity
- View comprehensive analytics
- Manage users and content
- Generate reports

##  Real-time Features

The platform includes real-time updates for:
- New food donations appearing instantly
- Request status changes
- Notifications for all users
- Live analytics updates

##  Deployment

### Environment Variables
Make sure to set these in your deployment platform:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Deploy to Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

##  Security

- **Row Level Security** - Database-level access control
- **Role-based permissions** - Different access levels
- **Secure authentication** - Supabase Auth integration
- **Data validation** - Input sanitization and validation

##  Analytics

The platform provides comprehensive analytics:
- Total users and donations
- Active donations and requests
- User engagement metrics
- Impact measurement (people fed, meals saved)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is licensed under the MIT License.

##  Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

##  Demo Credentials

For testing purposes, you can use these demo accounts:
- **Restaurant**: restaurant@demo.com / demo123
- **NGO**: ngo@demo.com / demo123
- **Society**: society@demo.com / demo123
- **Admin**: admin@demo.com / demo123

---

Built to reduce food waste and help communities in need.
=======
Resqfood – Food Donation Platform
Resqfood is a web application that reduces food wastage by connecting surplus food providers with NGOs to enable efficient food donations.

Key Features
List surplus food from restaurants and households
NGOs can view and request available food
Simple, responsive, and user-friendly UI

Tech Stack
Frontend: React.js, TypeScript, JavaScript
Styling: Tailwind CSS
Tools: Git, GitHub, VS Code
User authentication (Donors / NGOs)
Backend & database integration
Location-based matching and tracking

>>>>>>> cbfeb62258d0ac7f3e077cdb29e71723ddec00fd
>>>>>>> Repository maintained by Ayan Jinabade.

