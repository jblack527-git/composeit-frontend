import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <nav className="navbar navbar-expand-lg" style={{ 
                backgroundColor: 'rgba(246, 209, 157, 0)',
                padding: '1rem' 
            }}>
                <div className="container">
                    <div className="d-flex justify-content-center w-100">
                        <div className="me-3">
                            <button 
                                className="btn"
                                style={{
                                    backgroundColor: 'rgba(221, 192, 152, 0.7)',
                                    fontFamily: 'Geo',
                                    color: 'black'
                                }}
                            >
                                Find Out Scale
                            </button>
                        </div>
                        
                        <button 
                            className="btn"
                            disabled
                            style={{
                                backgroundColor: '#e0e0e0',
                                fontFamily: 'Geo',
                                color: '#888',
                                cursor: 'not-allowed'
                            }}
                        >
                            Lookup Scale Information
                        </button>
                    </div>
                </div>
            </nav>

            <div style={{
                height: isHovered ? 'auto' : '0',
                overflow: 'hidden',
                transition: 'height 0.3s ease-in-out',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'rgba(246, 209, 157, 0)'
            }}>
                <div style={{
                    padding: isHovered ? '10px' : '0',
                    transition: 'padding 0.3s ease-in-out'
                }}>
                    <Link 
                        to="/semitones" 
                        className="btn d-block"
                        style={{
                            backgroundColor: 'rgba(221, 192, 152, 0.7)',
                            fontFamily: 'Geo',
                            color: 'black',
                            marginBottom: '5px',
                            width: '160px'
                        }}
                    >
                        By Semitones
                    </Link>
                    <Link 
                        to="/chords" 
                        className="btn d-block"
                        style={{
                            backgroundColor: 'rgba(221, 192, 152, 0.7)',
                            fontFamily: 'Geo',
                            color: 'black',
                            width: '160px'
                        }}
                    >
                        By Chords
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar; 