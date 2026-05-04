import React, { useState } from 'react';

const NOTE_OPTIONS = [
    "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
];

const QUALITY_OPTIONS = [
    { value: "MAJOR", label: "Major" },
    { value: "MINOR", label: "Minor" },
    { value: "DIMINISHED", label: "Diminished" }
];

function AddChordPopover({ onAdd }) {
    const [tonic, setTonic] = useState("C");
    const [quality, setQuality] = useState("MAJOR");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ tonic, quality });
    };

    const fieldStyle = {
        fontFamily: 'Geo',
        padding: '6px 8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: 'white',
        width: '100%'
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                minWidth: '180px',
                fontFamily: 'Geo'
            }}
        >
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'Geo' }}>
                <span>Tonic</span>
                <select value={tonic} onChange={(e) => setTonic(e.target.value)} style={fieldStyle}>
                    {NOTE_OPTIONS.map((note) => (
                        <option key={note} value={note}>{note}</option>
                    ))}
                </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'Geo' }}>
                <span>Quality</span>
                <select value={quality} onChange={(e) => setQuality(e.target.value)} style={fieldStyle}>
                    {QUALITY_OPTIONS.map((q) => (
                        <option key={q.value} value={q.value}>{q.label}</option>
                    ))}
                </select>
            </label>

            <button
                type="submit"
                className="btn"
                style={{
                    backgroundColor: '#DDC098',
                    color: 'white',
                    border: '1px solid #ccc',
                    fontFamily: 'Geo'
                }}
            >
                Add Chord
            </button>
        </form>
    );
}

export default AddChordPopover;
