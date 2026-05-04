import React from 'react';

function ChordChip({ label, onRemove }) {
    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#DDC098',
                color: 'white',
                border: '1px solid #ccc',
                borderRadius: '20px',
                padding: '6px 12px',
                fontFamily: 'Geo',
                fontSize: '1em',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <span>{label}</span>
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${label}`}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.1em',
                    lineHeight: 1,
                    padding: 0
                }}
            >
                ×
            </button>
        </div>
    );
}

export default ChordChip;
