import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ marginTop: '4rem', color: '#fff', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>ComposeIt</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.85 }}>
        Discover scales from the notes you already have in your head.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <Link
          to="/scales"
          className="btn btn-light btn-lg"
          style={{ fontFamily: 'inherit' }}
        >
          View Scales
        </Link>
        <Link
          to="/semitones"
          className="btn btn-light btn-lg"
          style={{ fontFamily: 'inherit' }}
        >
          Find Out Scale
        </Link>
      </div>
    </div>
  );
}

export default Home;
