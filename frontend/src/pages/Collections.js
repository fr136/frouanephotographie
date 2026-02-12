import React from 'react';
import './Collections.css';

const Collections = () => {
  return (
    <div className="Collections">
      <section className="Hero" style={{
        backgroundImage: "url('Calanque Port d'alon Saint Cyr sur mer.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: '0',
        position: 'relative',
      }}>
        <div className="overlay" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          zIndex: '1',
        }}>
        </div>
        <div className="text" style={{
          position: 'relative',
          color: 'white',
          zIndex: '2',
          padding: '20px',
        }}>
          <h1>Collections</h1>
          <p>Explore our exclusive collections</p>
        </div>
      </section>
      {/* Rest of the Collections component */}
      <p>More content here.</p>
    </div>
  );
};

export default Collections;
