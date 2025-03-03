import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const ReviewModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#eeeeee5e] bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/3 animate-fadeIn">
        <AiOutlineCheckCircle className="text-green-500 text-6xl mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-500">{message}</h2>
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
