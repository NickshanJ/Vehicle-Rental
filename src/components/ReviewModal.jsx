import React from 'react';

const ReviewModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      {/* Modal Content */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">{message}</h2>
        <button
          className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 mx-auto block"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;