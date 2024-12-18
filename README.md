# HOSE Platform - Hub of Social Empowerment

A decentralized platform for social good, connecting communities and driving positive change through collective action.

## Features

- **User Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control
  - Password reset functionality

- **Campaign Management**
  - Create and manage social impact campaigns
  - Track campaign progress and impact
  - Participant management
  - Campaign analytics

- **Community System**
  - Create and join communities
  - Private and public community options
  - Role-based community management
  - Community activity tracking

- **Points & Rewards System**
  - Earn points through participation
  - Redeem points for rewards
  - Track point history
  - Reward management system

- **Achievement System**
  - Unlock achievements based on participation
  - Multiple achievement categories
  - Progress tracking
  - Special rewards for achievements

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Chart.js for analytics
- Responsive design
- Modern UI/UX

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API
- File upload support
- Email notifications
- Geocoding support
- Advanced query features
- Comprehensive error handling

## Project Structure

```
HOSE/
├── frontend/                # Frontend application
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard components
│   ├── styles/             # CSS stylesheets
│   ├── js/                 # JavaScript files
│   └── index.html          # Main entry point
│
├── backend/                # Backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Server entry point
│   ├── public/            # Public assets
│   └── logs/              # Application logs
│
└── README.md              # Project documentation
```

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register user
- POST `/api/v1/auth/login` - Login user
- GET `/api/v1/auth/logout` - Logout user
- GET `/api/v1/auth/me` - Get current user
- PUT `/api/v1/auth/updatedetails` - Update user details
- PUT `/api/v1/auth/updatepassword` - Update password
- POST `/api/v1/auth/forgotpassword` - Request password reset
- PUT `/api/v1/auth/resetpassword/:resettoken` - Reset password

### Campaigns
- GET `/api/v1/campaigns` - Get all campaigns
- GET `/api/v1/campaigns/:id` - Get single campaign
- POST `/api/v1/campaigns` - Create campaign
- PUT `/api/v1/campaigns/:id` - Update campaign
- DELETE `/api/v1/campaigns/:id` - Delete campaign
- POST `/api/v1/campaigns/:id/join` - Join campaign
- DELETE `/api/v1/campaigns/:id/leave` - Leave campaign

### Communities
- GET `/api/v1/communities` - Get all communities
- GET `/api/v1/communities/:id` - Get single community
- POST `/api/v1/communities` - Create community
- PUT `/api/v1/communities/:id` - Update community
- DELETE `/api/v1/communities/:id` - Delete community
- POST `/api/v1/communities/:id/join` - Join community
- DELETE `/api/v1/communities/:id/leave` - Leave community
- PUT `/api/v1/communities/:id/requests/:userId` - Handle join request

### Rewards
- GET `/api/v1/rewards` - Get all rewards
- GET `/api/v1/rewards/:id` - Get single reward
- POST `/api/v1/rewards` - Create reward (Admin)
- PUT `/api/v1/rewards/:id` - Update reward (Admin)
- DELETE `/api/v1/rewards/:id` - Delete reward (Admin)
- POST `/api/v1/rewards/:id/claim` - Claim reward
- PUT `/api/v1/rewards/:id/claims/:userId` - Update claim status (Admin)

### Achievements
- GET `/api/v1/achievements` - Get all achievements
- GET `/api/v1/achievements/:id` - Get single achievement
- POST `/api/v1/achievements` - Create achievement (Admin)
- PUT `/api/v1/achievements/:id` - Update achievement (Admin)
- DELETE `/api/v1/achievements/:id` - Delete achievement (Admin)
- POST `/api/v1/achievements/check` - Check user achievements
- GET `/api/v1/achievements/user/:userId` - Get user achievements

## Setup & Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Open index.html in your browser or use a local server

## Deployment

### Backend
- Deploy to Render or similar platform
- Set environment variables
- Enable CORS for frontend domain

### Frontend
- Deploy to GitHub Pages
- Update API base URL to production backend URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details