import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg" style={{ 
            backgroundColor: 'rgba(246, 209, 157, 0)',
            padding: '1rem' 
        }}>
            <div className="container">
                <div className="d-flex justify-content-center w-100">
                    <div 
                        className="position-relative me-3"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <button 
                            className="btn"
                            style={{
                                backgroundColor: '#DDC098',
                                fontFamily: 'Geo',
                                color: 'black'
                            }}
                        >
                            Find Out Scale
                        </button>
                        
                        {isHovered && (
                            <div 
                                className="position-absolute"
                                style={{
                                    top: '100%',
                                    left: '0',
                                    zIndex: 1000,
                                    minWidth: '160px'
                                }}
                            >
                                <Link 
                                    to="/semitones" 
                                    className="btn d-block"
                                    style={{
                                        backgroundColor: '#DDC098',
                                        fontFamily: 'Geo',
                                        color: 'black',
                                        marginTop: '5px'
                                    }}
                                >
                                    By Semitones
                                </Link>
                                <Link 
                                    to="/chords" 
                                    className="btn d-block"
                                    style={{
                                        backgroundColor: '#DDC098',
                                        fontFamily: 'Geo',
                                        color: 'black',
                                        marginTop: '5px'
                                    }}
                                >
                                    By Chords
                                </Link>
                            </div>
                        )}
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
    );
}

export default Navbar; 