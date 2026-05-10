import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const btnStyle = {
    backgroundColor: 'rgba(221, 192, 152, 0.7)',
    fontFamily: 'Geo',
    color: 'black',
    width: '160px',
};

function Navbar() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar navbar-expand-lg" style={{
            backgroundColor: 'rgba(246, 209, 157, 0)',
            padding: '1rem'
        }}>
            <div className="container">
                <div className="d-flex flex-column align-items-center gap-2 w-100">
                    <Link className="btn" style={btnStyle} to="/scales">
                        View Scales
                    </Link>
                    <div className="dropdown" ref={containerRef}>
                        <button
                            className="btn dropdown-toggle"
                            style={btnStyle}
                            type="button"
                            aria-expanded={open}
                            onClick={() => setOpen(prev => !prev)}
                        >
                            Find Out Scale
                        </button>
                        <ul className={`dropdown-menu${open ? ' show' : ''}`}>
                            <li>
                                <Link
                                    className="dropdown-item"
                                    to="/semitones"
                                    onClick={() => setOpen(false)}
                                >
                                    By Semitones
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="dropdown-item"
                                    to="/chords"
                                    onClick={() => setOpen(false)}
                                >
                                    By Chords
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
