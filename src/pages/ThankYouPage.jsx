import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">

        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-3xl font-black text-gray-900 mb-3">
          Booking Confirmed!
        </h1>

        <p className="text-gray-500 text-base mb-2">
          Your payment was successful and your vehicle has been booked.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          A confirmation email with your invoice will be sent to your registered email address.
        </p>

        {/* Booking summary hint */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 text-left">
          <p className="text-orange-700 font-semibold text-sm">📋 What happens next?</p>
          <ul className="text-orange-600 text-sm mt-2 space-y-1">
            <li>• Your booking will appear in your profile within a few seconds</li>
            <li>• Check your email for the booking invoice</li>
            <li>• Contact support if you have any questions</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/profile"
            className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;