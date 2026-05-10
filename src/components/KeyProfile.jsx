import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  urlSlugToTonic,
  urlSlugToQuality,
  qualityLabel,
  tonicToUrlSlug,
  qualityToUrlSlug,
  parseScaleName,
} from '../constants/music';
import { ACCENT, BUTTON_BG } from '../constants/theme';
import { useAdvancedMode } from '../context/AdvancedModeContext';

const cardStyle = {
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '16px',
  backgroundColor: BUTTON_BG,
};

const cardTitleStyle = {
  fontFamily: 'Geo',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#000',
  marginBottom: '8px',
};

const cardBodyStyle = {
  fontFamily: 'Geo',
  fontSize: '1.05rem',
  color: '#000',
};

function KeyProfile() {
  const { tonic: tonicSlug, quality: qualitySlug } = useParams();
  const navigate = useNavigate();
  const { advanced } = useAdvancedMode();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derive the quality string for the banner check
  const quality = urlSlugToQuality(qualitySlug);

  useEffect(() => {
    const tonic = urlSlugToTonic(tonicSlug);

    setLoading(true);
    setProfile(null);
    setError(null);

    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tonic, quality }),
    })
      .then(r => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (data && data.tonic) {
          setProfile(data);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [tonicSlug, qualitySlug, quality]);

  const handleBack = () => {
    if (window.history.length <= 1) {
      navigate('/scales');
    } else {
      navigate(-1);
    }
  };

  const title = profile
    ? `${profile.tonic} ${qualityLabel(profile.quality)}`
    : `${urlSlugToTonic(tonicSlug)} ${qualityLabel(urlSlugToQuality(qualitySlug))}`;

  // Sort chords by numeric key (1–7)
  const DEGREE_ORDER = { 'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6, 'vii': 7 };
  const degreeRank = (d) => DEGREE_ORDER[d.toLowerCase().replace(/[°+]/g, '')] ?? 99;

  const sortedChords = profile?.chords
    ? Object.entries(profile.chords).sort(([a], [b]) => degreeRank(a) - degreeRank(b))
    : [];

  const makeScaleLink = (scaleStr) => {
    if (!scaleStr) return null;
    const { tonic, quality } = parseScaleName(scaleStr);
    return `/scales/${tonicToUrlSlug(tonic)}/${qualityToUrlSlug(quality)}`;
  };

  const showAdvancedBanner = !advanced && quality !== 'MAJOR' && quality !== 'MINOR';

  return (
    <div style={{ padding: '0 16px 40px' }}>
      {/* Back arrow */}
      <button
        onClick={handleBack}
        aria-label="Go back"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: '#000',
          padding: '8px',
          marginBottom: '8px',
          fontFamily: 'Geo',
        }}
      >
        ← Back
      </button>

      {/* Centered card */}
      <div style={{ maxWidth: '420px', margin: '0 auto' }}>
        {/* Title */}
        <h2
          style={{
            fontFamily: 'Geo',
            fontSize: '2rem',
            color: '#000',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          {title}
        </h2>

        {/* Banner shown on advanced scales when not in advanced mode */}
        {showAdvancedBanner && (
          <div
            style={{
              backgroundColor: 'rgba(246, 209, 157, 0.6)',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '8px',
              padding: '10px 16px',
              marginBottom: '16px',
              fontFamily: 'Geo',
              fontSize: '0.9rem',
              color: '#000',
              textAlign: 'center',
            }}
          >
            This is an advanced scale. Toggle <strong>Advanced mode</strong> in the top-right to explore more.
          </div>
        )}

        {loading && (
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <p style={{ fontFamily: 'Geo', color: '#000', margin: 0 }}>Loading…</p>
          </div>
        )}

        {!loading && (error || !profile) && (
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <p style={{ fontFamily: 'Geo', color: '#000', marginBottom: '12px' }}>
              Scale not found.
            </p>
            <Link to="/scales" style={{ fontFamily: 'Geo', color: ACCENT }}>
              ← Browse all scales
            </Link>
          </div>
        )}

        {!loading && profile && (
          <>
            {/* Semitones card */}
            <div style={cardStyle}>
              <div style={cardTitleStyle}>Semitones</div>
              <div style={cardBodyStyle}>
                {profile.semitones ? profile.semitones.join(', ') : '—'}
              </div>
            </div>

            {/* Chords card */}
            <div style={cardStyle}>
              <div style={cardTitleStyle}>Chords</div>
              {sortedChords.length > 0 ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sortedChords.length}, 1fr)`, marginBottom: '4px' }}>
                    {sortedChords.map(([degree]) => (
                      <div key={`r-${degree}`} style={{ fontFamily: 'Geo', textAlign: 'center', fontSize: '0.85rem', color: '#555' }}>
                        {degree}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sortedChords.length}, 1fr)` }}>
                    {sortedChords.map(([degree, chord]) => (
                      <div key={`c-${degree}`} style={{ ...cardBodyStyle, textAlign: 'center' }}>
                        {chord}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={cardBodyStyle}>—</div>
              )}
            </div>

            {/* Mode */}
            {profile.mode && (
              <div style={{ fontFamily: 'Geo', color: '#000', marginBottom: '10px', textAlign: 'center' }}>
                Mode: {profile.mode}
              </div>
            )}

            {/* Relative / Parallel */}
            <div style={{ fontFamily: 'Geo', color: '#000', textAlign: 'center', lineHeight: '1.8' }}>
              {profile.relativeScale && (
                <div>
                  Relative:{' '}
                  <Link
                    to={makeScaleLink(profile.relativeScale)}
                    style={{ color: ACCENT, textDecoration: 'none' }}
                  >
                    {profile.relativeScale
                      .split(' ')
                      .map((w, i) =>
                        i === 0
                          ? w
                          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                      )
                      .join(' ')}
                  </Link>
                </div>
              )}
              {profile.parallelScale && (
                <div>
                  Parallel:{' '}
                  <Link
                    to={makeScaleLink(profile.parallelScale)}
                    style={{ color: ACCENT, textDecoration: 'none' }}
                  >
                    {profile.parallelScale
                      .split(' ')
                      .map((w, i) =>
                        i === 0
                          ? w
                          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                      )
                      .join(' ')}
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default KeyProfile;
