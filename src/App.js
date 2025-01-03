import React from 'react';
import './App.css';
import ScaleList from './components/ScaleList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <div style={{ textAlign: "center" }}>
        <img src="nulogo.png" alt="Logo" style={{ maxWidth: "20%", height: "auto", padding: '2%'}} />
      </div>
      <ScaleList />
    </div>
  );
}

export default App;
