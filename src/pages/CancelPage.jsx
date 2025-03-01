import React from 'react';

const CancelPage = () => (
  <div
    style={{
      textAlign: 'center',
      marginTop: '50px',
      backgroundColor: '#f9f9f9',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '50px auto',
    }}
  >
    <h1 style={{ fontSize: '2.5rem', color: '#f44336', marginBottom: '20px' }}>
      ❌ Payment Cancelled
    </h1>
    <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '30px' }}>
      You cancelled the payment process. Feel free to try again when you're ready.
    </p>
    <a
      href="/payment"
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '1.1rem',
        color: '#fff',
        backgroundColor: '#f44336',
        textDecoration: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#e53935')}
      onMouseOut={(e) => (e.target.style.backgroundColor = '#f44336')}
    >
      Return to Payment Page
    </a>
  </div>
);

export default CancelPage;
