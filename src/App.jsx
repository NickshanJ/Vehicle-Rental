import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import VehicleList from './components/VehicleList';
import VehicleDetails from './components/VehicleDetails';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ManageVehicleListings from './pages/ManageVehicleListings';
import ManageUserAccounts from './pages/ManageUserAccounts';
import ManageBookings from './pages/ManageBookings';
import MonitorTransactions from './pages/MonitorTransactions';
import UserSupportInquiries from './pages/UserSupportInquiries';
import BookingForm from './components/BookingForm';
import PaymentHandler from './components/PaymentHandler'; 
import ThankYouPage from './pages/ThankYouPage'; 
import Logout from './components/Logout';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthContext } from './context/AuthContext';
import SearchResults from './components/SearchResults';
import BookingPage from './components/BookingPage';
import ReviewPage from './components/ReviewPage';
import SupportPage from './components/SupportPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';
import CancelPage from './pages/CancelPage';

const stripePromise = loadStripe('pk_test_51Qx6miEOViAAkwnZNUFEpxovVDOZuUVHO1Ai53f0J0dKWVe9i6HDvTkXwfCUiWptSZseGnfutZDkzQz9pDLR5eDU00WF2HEy6Q'); // Your Publishable Stripe Key

const App = () => {
  const { auth } = useContext(AuthContext); 

  console.log("App - auth:", auth); 

  return (
    <>
      <Header isAuthenticated={auth.isAuthenticated} />
      <Elements stripe={stripePromise}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/payment-handler" element={<PaymentHandler />} /> 
          <Route path="/thank-you" element={<ThankYouPage />} /> 

          {/* Stripe Payment Routes */}
          <Route path="/checkout-cancelled" element={<CancelPage />} />
          <Route path="/payment" element={<PaymentForm amount={5000} />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route 
              path="/vehicles" 
              element={
                <ErrorBoundary>
                  <VehicleList />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/vehicles/:id" 
              element={
                <ErrorBoundary>
                  <VehicleDetails />
                </ErrorBoundary>
              }
            />
            <Route 
              path="/bookings" 
              element={
                <ErrorBoundary>
                  <Bookings />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/book/:id" 
              element={
                <ErrorBoundary>
                  <BookingPage />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/review/:id" 
              element={
                <ErrorBoundary>
                  <ReviewPage />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ErrorBoundary>
                  <Profile />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/support" 
              element={
                <ErrorBoundary>
                  <SupportPage />
                </ErrorBoundary>
              } 
            />

            {/* Admin Dashboard with Nested Routes */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Navigate to="vehicle-listings" />} />
              <Route 
                path="vehicle-listings" 
                element={
                  <ErrorBoundary>
                    <ManageVehicleListings />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="user-accounts" 
                element={
                  <ErrorBoundary>
                    <ManageUserAccounts />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="bookings" 
                element={
                  <ErrorBoundary>
                    <ManageBookings />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="transactions" 
                element={
                  <ErrorBoundary>
                    <MonitorTransactions />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="support" 
                element={
                  <ErrorBoundary>
                    <UserSupportInquiries />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="create-booking" 
                element={
                  <ErrorBoundary>
                    <BookingForm />
                  </ErrorBoundary>
                } 
              /> 
            </Route>
          </Route>

          {/* Other Routes */}
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </Elements>
      <Footer />
    </>
  );
};

export default App;