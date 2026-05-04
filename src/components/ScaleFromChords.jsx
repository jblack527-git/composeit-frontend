import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChordChip from './ChordChip';
import AddChordPopover from './AddChordPopover';

const QUALITY_LABELS = {
    MAJOR: 'Major',
    MINOR: 'Minor',
    DIMINISHED: 'Diminished'
};

function stripEnharmonic(tonic) {
    const slash = tonic.indexOf('/');
    return slash === -1 ? tonic : tonic.slice(0, slash);
}

function toChordString({ tonic, quality }) {
    const tonicStr = stripEnharmonic(tonic);
    const suffix =
        quality === 'MINOR' ? 'm' :
        quality === 'DIMINISHED' ? '°' : '';
    return tonicStr + suffix;
}

function toChipLabel({ tonic, quality }) {
    return `${stripEnharmonic(tonic)} ${QUALITY_LABELS[quality]}`;
}

function ScaleFromChords() {
    const [chords, setChords] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [scales, setScales] = useState([]);
    const [error, setError] = useState(null);
    const nextIdRef = useRef(1);
    const addContainerRef = useRef(null);

    useEffect(() => {
        if (chords.length === 0) {
            setScales([]);
            setError(null);
            return;
        }

        setError(null);
        fetch('/api/scales-from-chords', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chords: chords.map(toChordString) })
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Server error: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setScales(data.scales ?? []);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [chords]);

    useEffect(() => {
        if (!isPopoverOpen) return undefined;
        function handleClickOutside(e) {
            if (addContainerRef.current && !addContainerRef.current.contains(e.target)) {
                setIsPopoverOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPopoverOpen]);

    const handleAddChord = ({ tonic, quality }) => {
        setChords((prev) => [...prev, { id: nextIdRef.current++, tonic, quality }]);
        setIsPopoverOpen(false);
    };

    const handleRemoveChord = (id) => {
        setChords((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <div className="container mt-2">
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '15px',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}
            >
                {chords.map((chord) => (
                    <ChordChip
                        key={chord.id}
                        label={toChipLabel(chord)}
                        onRemove={() => handleRemoveChord(chord.id)}
                    />
                ))}

                <div ref={addContainerRef} style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                        type="button"
                        onClick={() => setIsPopoverOpen((prev) => !prev)}
                        aria-label="Add chord"
                        aria-expanded={isPopoverOpen}
                        style={{
                            backgroundColor: isPopoverOpen ? '#DDC098' : 'rgba(221, 192, 152, 0.7)',
                            color: isPopoverOpen ? 'white' : 'black',
                            border: '1px solid #ccc',
                            borderRadius: '20px',
                            padding: '6px 14px',
                            fontFamily: 'Geo',
                            fontSize: '1.1em',
                            lineHeight: 1,
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        +
                    </button>
                    {isPopoverOpen && <AddChordPopover onAdd={handleAddChord} />}
                </div>
            </div>

            {error && <p className="text-danger">Error: {error}</p>}

            {chords.length === 0 ? (
                <p style={{ padding: '3%', fontFamily: 'Geo', textAlign: 'center' }}>
                    Add a chord to start
                </p>
            ) : scales && scales.length > 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '15px',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}
                    >
                        {scales.map((scale, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: '#F69DEE',
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
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                {scale}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p style={{ padding: '3%', fontFamily: 'Geo', textAlign: 'center' }}>No scales found</p>
            )}
        </div>
    );
}

export default ScaleFromChords;
