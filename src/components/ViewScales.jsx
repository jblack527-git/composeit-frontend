import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TONICS, tonicToUrlSlug, qualityToUrlSlug } from '../constants/music';
import { BUTTON_BG, BUTTON_BG_ACTIVE, BUTTON_BG_SUBTLE, DROPDOWN_BG } from '../constants/theme';
import { useAdvancedMode } from '../context/AdvancedModeContext';

const FALLBACK_QUALITIES_ALL = [
  { id: 'MAJOR', label: 'Major' },
  { id: 'MINOR', label: 'Minor' },
  { id: 'HARMONIC_MINOR', label: 'Harmonic Minor' },
  { id: 'MELODIC_MINOR', label: 'Melodic Minor' },
  { id: 'DORIAN', label: 'Dorian' },
  { id: 'PHRYGIAN', label: 'Phrygian' },
  { id: 'LYDIAN', label: 'Lydian' },
  { id: 'MIXOLYDIAN', label: 'Mixolydian' },
  { id: 'LOCRIAN', label: 'Locrian' },
  { id: 'PENTATONIC_MAJOR', label: 'Pentatonic Major' },
  { id: 'PENTATONIC_MINOR', label: 'Pentatonic Minor' },
  { id: 'DIMINISHED', label: 'Diminished' },
];

const EASY_IDS = new Set(['MAJOR', 'MINOR']);

const qualityBtnStyle = {
  display: 'block',
  backgroundColor: BUTTON_BG_SUBTLE,
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: '6px',
  padding: '8px 12px',
  fontFamily: 'Geo',
  fontSize: '0.95rem',
  color: '#000',
  textDecoration: 'none',
  textAlign: 'center',
  transition: 'background-color 150ms, transform 120ms',
};

function TonicCell({ tonic, isOpen, onToggle, qualities, loadingQualities }) {
  const slug = tonicToUrlSlug(tonic);
  const cellRef = useRef(null);

  return (
    <div ref={cellRef} style={{ position: 'relative' }}>
      <div
        style={{
          backgroundColor: isOpen ? BUTTON_BG_ACTIVE : BUTTON_BG,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px',
          cursor: 'pointer',
          userSelect: 'none',
          fontFamily: 'Geo',
          fontSize: '1.3rem',
          color: '#000',
        }}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={e => e.key === 'Enter' && onToggle()}
      >
        {tonic}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: '180px',
            backgroundColor: DROPDOWN_BG,
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            padding: '8px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {loadingQualities ? (
            <p style={{ fontFamily: 'Geo', margin: 0, fontSize: '0.85rem' }}>Loading…</p>
          ) : (
            qualities.map(q => (
              <Link
                key={q.id}
                to={`/scales/${slug}/${qualityToUrlSlug(q.id)}`}
                style={qualityBtnStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = BUTTON_BG_ACTIVE;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = BUTTON_BG_SUBTLE;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {q.label}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ViewScales() {
  const [openTonic, setOpenTonic] = useState(null);
  const [qualities, setQualities] = useState([]);
  const [loadingQualities, setLoadingQualities] = useState(true);
  const { advanced } = useAdvancedMode();

  useEffect(() => {
    setLoadingQualities(true);
    fetch(`/api/qualities?advanced=${advanced}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load qualities');
        return r.json();
      })
      .then(data => {
        setQualities(data.qualities ?? FALLBACK_QUALITIES_ALL.filter(q => advanced || EASY_IDS.has(q.id)));
        setLoadingQualities(false);
      })
      .catch(() => {
        setQualities(FALLBACK_QUALITIES_ALL.filter(q => advanced || EASY_IDS.has(q.id)));  // fallback mirrors server logic
        setLoadingQualities(false);
      });
  }, [advanced]);

  useEffect(() => {
    if (!openTonic) return;
    const close = (e) => {
      if (!e.target.closest('[data-tonic-cell]')) setOpenTonic(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openTonic]);

  return (
    <div className="container mt-2">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 15px 40px' }}>
<div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}
        >
          {TONICS.map(tonic => (
            <div key={tonic} data-tonic-cell>
              <TonicCell
                tonic={tonic}
                isOpen={openTonic === tonic}
                onToggle={() => setOpenTonic(prev => (prev === tonic ? null : tonic))}
                qualities={qualities}
                loadingQualities={loadingQualities}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewScales;
