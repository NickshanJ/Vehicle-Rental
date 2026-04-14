# Vehicle Rental System

## Overview

The Vehicle Rental System is a full-stack web application for renting vehicles such as cars and bikes. It includes user registration, booking, payment processing, review submission, and admin management.

The project has:
- A React + Vite frontend located in the `Vehicle Rental` folder.
- A Node.js + Express backend located in the `Vehical-rental-server` folder.
- Stripe payment processing for booking payments.
- MongoDB as the database.

## Key Features

- User registration and login
- Profile management
- Browse vehicles with details and images
- Book vehicles for selected dates
- Stripe payment checkout
- Booking and rental history
- Review system for vehicles
- Support ticket submission
- Admin dashboard for managing users, vehicles, bookings, reviews, and support queries

## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Stripe React SDK (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- FontAwesome icons

### Backend
- Node.js
- Express.js
- MongoDB / Mongoose
- Stripe (`stripe`)
- JWT authentication (`jsonwebtoken`)
- Multer (file uploads)
- Nodemailer (email service)
- PDFKit (invoice generation)
- express-rate-limit
- express-validator

## Recommended Setup

### Prerequisites
- Node.js 14+ installed
- MongoDB running locally or accessible via connection string
- npm or yarn installed

### Backend Setup

1. Open a terminal and go to the backend folder:
   ```bash
   cd "c:/Guvi/Vehicle Rental/Vehical-rental-server"
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `Vehical-rental-server` and add values for:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_USER=your_email_address
   EMAIL_APP_PASSWORD=your_email_app_password
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Open a terminal and go to the frontend folder:
   ```bash
   cd "c:/Guvi/Vehicle Rental/Vehicle Rental"
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open the app in your browser at:
   ```
   http://localhost:5173
   ```

## Running the App

1. Start the backend server first.
2. Start the frontend server.
3. Open the frontend URL in your browser.
4. Register a new user and create bookings.
5. Use Stripe checkout when making a payment.

## Stripe Test Cards

You can use these Stripe test cards for booking payments during development:

- Visa: `4242 4242 4242 4242`
- Declined card: `4000 0000 0000 9995`
- 3D Secure / authentication required: `4000 0027 6000 3184`

Use any future expiry date, for example:
- Expiry: `12/34`
- CVC: `123`
- ZIP: `12345`

> If your Stripe checkout is in test mode, these cards will simulate payment behavior without charges.

## Sample Admin Credentials

- Username: `admin`
- Password: `adminpassword`

> Use these credentials to access admin management features if admin accounts are preconfigured.

## Project Structure

```text
Vehicle Rental/
  ├─ src/
  │   ├─ components/
  │   ├─ context/
  │   ├─ hooks/
  │   ├─ pages/
  │   └─ services/
  ├─ package.json
  └─ vite.config.js

Vehical-rental-server/
  ├─ controllers/
  ├─ middleware/
  ├─ models/
  ├─ routes/
  ├─ uploads/
  ├─ server.js
  └─ package.json
```

## Usage Summary

- Register or login as a user.
- Browse available vehicles and open vehicle details.
- Select booking dates and proceed to payment.
- View booking history and rental details.
- Submit reviews and support tickets.
- Admins can manage users, vehicles, bookings, reviews, and support queries.

## Notes

- The backend supports API routes under `/api/*`.
- CORS is enabled for `http://localhost:5173` and the deployed frontend origin.
- Uploaded files are served from `Vehical-rental-server/uploads`.
