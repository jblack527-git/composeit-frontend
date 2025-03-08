import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Scales from './components/ScaleList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div style={{ textAlign: "center" }}>
          <img src="nulogo.png" alt="Logo" style={{ maxWidth: "20%", height: "auto", padding: '2%'}} />
        </div>
        <Navbar />
          <Routes>
            <Route path="/semitones" element={<Scales />} />
            <Route path="/chords" element={<div>Chords Component (Coming Soon)</div>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
