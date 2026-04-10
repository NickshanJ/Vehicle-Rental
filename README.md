Vehicle Rental System

Overview:

The Vehicle Rental System is a web application designed to facilitate the rental of various types of vehicles, including cars and bikes. It allows users to browse available vehicles, make bookings, and manage their profiles. Admins can manage users, vehicles, bookings, and other aspects of the system.

Features:

 * User Registration and Authentication

 * Profile Management

 * Vehicle Browsing and Booking

 * Admin Management of Users, Vehicles, and Bookings

 * Payment Integration

 * Review System

 * Support for User Queries

 * Rental History and Dashboard for Users

User Capabilities: 

1. User Registration and Authentication:

Users can create a new account by providing their username, email, and password.

Users can log in using their credentials to access their accounts.

2. Profile Management:

Users can view and update their profile information, including their username, email, and profile picture.

Users can change their password and update other personal details.

3. Browse Vehicles:

Users can browse a list of available vehicles, including cars and bikes, with details such as make, model, year, price per day, availability, and images.

Users can view detailed information about each vehicle.

4. Vehicle Booking:

Users can book available vehicles for specific dates.

Users can view their current and past bookings.

5. Payment Integration:

Users can make payments for their bookings using integrated payment methods, such as Stripe.

6. Review System:

Users can leave reviews and ratings for vehicles they have rented.

Users can view reviews left by other users.

7. Support for User Queries:

Users can submit support queries or issues they encounter.

Users can view responses to their support queries.

8. Rental History and Dashboard:

Users can view their rental history, including details of all past bookings.

Users have access to a dashboard displaying their account information, bookings, and reviews.

Admin Capabilities:

1. Admin Login and Authentication:

Admins can log in using their credentials to access the admin dashboard.

Username : admin /
password : adminpassword

2. User Management:

Admins can view a list of all users registered in the system.

Admins can view detailed information about each user, including their bookings, payments, and reviews.

Admins can update user information and delete user accounts if necessary.

3. Vehicle Management:

Admins can view a list of all vehicles available in the system.

Admins can add new vehicles to the system, including details such as make, model, year, price per day, availability, and images.

Admins can update vehicle information and delete vehicles from the system.

4. Booking Management:

Admins can view all bookings made by users.

Admins can view detailed information about each booking, including vehicle details, booking dates, and payment status.

Admins can update booking information and delete bookings if necessary.

5. Payment Management:

Admins can view a list of all payments made by users.

Admins can view detailed information about each payment, including amount, date, and status.

6. Review Management:

Admins can view all reviews left by users.

Admins can manage reviews by removing inappropriate or false reviews.

7. Support Management:

Admins can view and respond to support queries submitted by users.

Admins can manage and resolve user issues effectively.

8. Dashboard:

Admins have access to a comprehensive dashboard displaying key metrics and statistics about the system, including user activity, bookings, payments, and reviews.

Technologies Used:

 * Frontend: React, Tailwind CSS, Axios

 * Backend: Node.js, Express.js, MongoDB

 * Authentication: JWT (JSON Web Token)

 * Payment Integration: Stripe

 * Deployment: Netlify (Frontend), Render (Backend)

Setup and Installation:

Prerequisites

Node.js(v14.x or later)

MongoDB

npm or yarn

 ** Backend Setup:

1. Clone the repository:

git clone https://github.com/yourusername/vehicle-rental-system.git

cd vehicle-rental-system

2. Install dependencies:

npm install
# or
yarn install

3. Create a .env file in the root directory and add the following environment variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email_address
EMAIL_APP_PASSWORD=your_email_app_password

4. Start the backend server:

node server.js

 ** Frontend Setup:

1. Navigate to the frontend directory:

cd frontend

2. Install dependencies:

npm install
# or
yarn install

3. Start the frontend server:

npm run dev

To Use this Visit this page - https://online-vehicle-rental.netlify.app/

Usage:

1. Access the application: Open your browser and navigate to http://localhost:3000 for the frontend.

2. User Registration: Register a new user account.

3. User Login: Log in with your credentials.

4. Browse Vehicles: View available vehicles and make a booking.

5. Profile Management: Update your profile details and view your booking history.

6. Admin Features: Admins can log in and manage users, vehicles, and bookings.

Project Structure:
.
├── backend
│   ├── controllers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── vehicleController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── authenticateToken.js
│   │   ├── authorizeAdmin.js
│   │   └── rateLimiter.js
│   ├── models
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   └── Vehicle.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── vehicleRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   └── .env
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Auth
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   ├── Dashboard
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── UserDashboard.js
│   │   │   ├── Vehicles
│   │   │   │   ├── VehicleList.js
│   │   │   │   ├── VehicleDetails.js
│   │   │   ├── Profile
│   │   │   │   ├── Profile.js
│   │   ├── context
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   └── .env
└── README.md

Contributing:

1. Fork the repository

2. Create a new branch: git checkout -b feature-branch

3. Make your changes

4. Commit your changes: git commit -m 'Add some feature'

5. Push to the branch: git push origin feature-branch

6. Create a Pull Request

Acknowledgements:

1. React

2. Node.js

3. Express.js

4. MongoDB

5. Tailwind CSS

6. Axios
