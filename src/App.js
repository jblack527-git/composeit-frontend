import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ScaleFromSemitone from './components/ScaleFromSemitone';
import ScaleFromChords from './components/ScaleFromChords';
import ViewScales from './components/ViewScales';
import KeyProfile from './components/KeyProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import gumClouds from './assets/gum-clouds.jpg';
import fujiClouds from './assets/fuji-clouds.jpg';

// Create a wrapper component to handle the background change
function AppContent() {
  const location = useLocation();
  
  const getBackgroundStyle = () => {
    if (location.pathname === '/semitones' || location.pathname === '/chords') {
      return {
        backgroundImage: `url(${gumClouds})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      };
    }
    if (location.pathname.startsWith('/scales')) {
      return {
        backgroundImage: `url(${fujiClouds})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      };
    }
    return {}; // Default background from App.css will be used
  };

  return (
    <div className="App" style={getBackgroundStyle()}>
      <div style={{ textAlign: "center" }}>
        <img src="nulogo.png" alt="Logo" style={{ maxWidth: "20%", height: "auto", padding: '2%'}} />
      </div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/semitones" element={<ScaleFromSemitone />} />
        <Route path="/chords" element={<ScaleFromChords />} />
        <Route path="/scales" element={<ViewScales />} />
        <Route path="/scales/:tonic/:quality" element={<KeyProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
