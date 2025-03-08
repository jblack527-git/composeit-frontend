import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Scales() {
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
            <div class="grid grid-cols-4 gap-4 p-4">
                {semitoneOptions.map((semitone, index) => (
                    <div class="form-check form-check-inline">
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
                            backgroundColor: selectedSemitones.includes(semitone) ? '#DDC098' : '#F6D19D',
                            color: selectedSemitones.includes(semitone) ? 'white' : 'black',
                            border: '1px solid #ccc',
                            fontFamily:'Geo'
                        }}>
                            {semitone}
                        </label>
                    </div>
                ))}
            </div>

            {error && <p className="text-danger">Error: {error}</p>}

            {
                scales.length > 0 ? (
                    <div style={{ textAlign: 'center'}}>
                        <div className="grid grid-cols-4 gap-4 p-4">
                            {scales.map((scale, index) => 
                            <label key={index} style={{
                                backgroundColor: '#F69DEE',
                                border: '1px solid #ccc',
                                maxWidth: "100%", 
                                height: "auto",
                                fontFamily:'Geo'
                                }}>{scale}
                            </label>)}
                        </div>
                    </div>
                ) : (
                    <p style={{padding: '3%', fontFamily:'Geo'}}>No scales found</p>
                )
            }
        </div>
    );
}

export default Scales;
