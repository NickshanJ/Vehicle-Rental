import React from 'react';

const ThankYouPage = () => (
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
    <h1 style={{ fontSize: '2.5rem', color: '#4CAF50', marginBottom: '20px' }}>
      🎉 Thank You for Your Payment!
    </h1>
    <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '30px' }}>
      Your transaction was successful. We truly appreciate your purchase.
    </p>
    <a
      href="/"
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '1.1rem',
        color: '#fff',
        backgroundColor: '#4CAF50',
        textDecoration: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')}
      onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
    >
      Go Back to Home
    </a>
  </div>
);

export default ThankYouPage;