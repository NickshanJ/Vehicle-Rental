import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">VR</span>
            </div>
            <span className="text-white font-bold text-lg">VehicleRental</span>
          </div>
          <p className="text-sm text-gray-400">Your trusted vehicle rental platform. Book bikes and cars easily, anytime.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-400 transition">Home</Link></li>
            <li><Link to="/vehicles" className="hover:text-orange-400 transition">Vehicles</Link></li>
            <li><Link to="/support" className="hover:text-orange-400 transition">Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-orange-400 transition">Login</Link></li>
            <li><Link to="/register" className="hover:text-orange-400 transition">Register</Link></li>
            <li><Link to="/profile" className="hover:text-orange-400 transition">My Profile</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        &copy; 2025 VehicleRental System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;