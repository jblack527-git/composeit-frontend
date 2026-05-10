import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TONICS, tonicToUrlSlug, qualityToUrlSlug, parseScaleName } from '../constants/music';
import { BUTTON_BG, BUTTON_BG_ACTIVE, SCALE_RESULT_BG } from '../constants/theme';

function ScaleFromSemitone() {
    const [scales, setScales] = useState([]);
    const [selectedSemitones, setSelectedSemitones] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedSemitones.length === 0) {
            setScales([]);
            setError(null);
            return;
        }

        setError(null);
        fetch('/api/scales-from-semitones', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "semitones": selectedSemitones.flatMap(s => s.split('/'))
            })
        })
        .then(response => response.json())
        .then(data => {
            setScales(data.scales ?? []);
        })
        .catch(error => {
            setError(error.message);
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
                {TONICS.map((semitone, index) => (
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
                            backgroundColor: selectedSemitones.includes(semitone) ? BUTTON_BG_ACTIVE : BUTTON_BG,
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
                scales && scales.length > 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '15px',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            {scales.map((scale, index) => {
                                const { tonic, quality } = parseScaleName(scale);
                                return (
                                    <Link
                                        key={index}
                                        to={`/scales/${tonicToUrlSlug(tonic)}/${qualityToUrlSlug(quality)}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: SCALE_RESULT_BG,
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                                padding: '10px 15px',
                                                fontFamily: 'Geo',
                                                fontSize: '1.1em',
                                                color: 'black',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '50px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                transition: 'transform 120ms',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            {scale}
                                        </div>
                                    </Link>
                                );
                            })}
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
