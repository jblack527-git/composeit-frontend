import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function ScaleFromSemitone() {
    console.log("Scales component rendered");
    const [scales, setScales] = useState([]);
    const [selectedSemitones, setSelectedSemitones] = useState([]);
    const [error, setError] = useState(null);

    const semitoneOptions = [
        "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
    ];

    useEffect(() => {
        if (selectedSemitones.length === 0) return;
        
        console.log("Fetching data...");
        fetch('http://localhost:8080/api/scales/scales', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "semitones": selectedSemitones
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Received data:", data);
            setScales(data.scales);
        })
        .catch(error => {
            setError(error.message);
            console.error('Error fetching scales:', error)
        });
    }, [selectedSemitones]);

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        setSelectedSemitones(prevState => {
            if (prevState.includes(value)) {
                return prevState.filter(semitone => semitone !== value);
            } else {
                return [...prevState, value];
            }
        });
    };

    return (
        <div className="container mt-2">
            <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                padding: '15px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {semitoneOptions.map((semitone, index) => (
                    <div key={index} className="form-check form-check-inline" style={{
                        margin: 0  // Override Bootstrap's default margin
                    }}>
                        <input 
                        className="btn-check" 
                        id={`btn-check-${index}`}
                        type="checkbox"
                        value={semitone}
                        checked={selectedSemitones.includes(semitone)}
                        onChange={handleCheckboxChange}
                        />
                        <label className="btn btn-primary" 
                        htmlFor={`btn-check-${index}`} 
                        style={{
                            backgroundColor: selectedSemitones.includes(semitone) ? '#DDC098' : 'rgba(221, 192, 152, 0.7)',
                            color: selectedSemitones.includes(semitone) ? 'white' : 'black',
                            border: '1px solid #ccc',
                            fontFamily: 'Geo',
                            width: '100%',  // Make buttons fill their grid cell
                            margin: 0       // Remove default margin
                        }}>
                            {semitone}
                        </label>
                    </div>
                ))}
            </div>

            {error && <p className="text-danger">Error: {error}</p>}

            {
                scales.length > 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)', // Two columns
                            gap: '15px',
                            maxWidth: '800px',  // Limit maximum width
                            margin: '0 auto'    // Center the grid
                        }}>
                            {scales.map((scale, index) => 
                                <div key={index} style={{
                                    backgroundColor: '#F69DEE',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',        // Rounded corners
                                    padding: '10px 15px',      // Add some padding
                                    fontFamily: 'Geo',
                                    fontSize: '1.1em',         // Slightly larger text
                                    color: 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '50px',         // Consistent height
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Subtle shadow
                                }}>
                                    {scale}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p style={{padding: '3%', fontFamily:'Geo'}}>No scales found</p>
                )
            }
        </div>
    );
}

export default ScaleFromSemitone;
