// The 12 chromatic tonics in display form (enharmonic pairs shown as "X/Y")
export const TONICS = [
  'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'
];

/**
 * Convert a display tonic (e.g. "C#/Db") to wire format for the API.
 * Takes the sharp side of enharmonic pairs: "C#/Db" → "C#", "C" → "C"
 */
export function tonicToWireFormat(tonic) {
  return tonic.split('/')[0];
}

/**
 * Convert a display tonic to a URL-safe slug.
 * "C#/Db" → "C-sharp"   "A#/Bb" → "A-sharp"   "C" → "C"
 * We always use the sharp side for consistency.
 */
export function tonicToUrlSlug(tonic) {
  const sharpSide = tonic.split('/')[0]; // "C#/Db" → "C#",  "C" → "C"
  return sharpSide.replace('#', '-sharp').replace(/b$/, '-flat');
}

/**
 * Convert a URL slug back to a bare tonic string suitable for the API.
 * "C-sharp" → "C#"   "B-flat" → "Bb"   "C" → "C"
 */
export function urlSlugToTonic(slug) {
  return slug.replace('-sharp', '#').replace('-flat', 'b');
}

/**
 * Convert a Quality enum id to a URL slug.
 * "PENTATONIC_MAJOR" → "pentatonic-major"
 */
export function qualityToUrlSlug(qualityId) {
  return qualityId.toLowerCase().replace(/_/g, '-');
}

/**
 * Convert a URL slug back to a Quality enum id.
 * "pentatonic-major" → "PENTATONIC_MAJOR"
 */
export function urlSlugToQuality(slug) {
  return slug.toUpperCase().replace(/-/g, '_');
}

/**
 * Convert a Quality enum id to a human-readable label.
 * "PENTATONIC_MAJOR" → "Pentatonic Major"
 */
export function qualityLabel(qualityId) {
  return qualityId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Parse a scale string returned by the backend (e.g. "C# PENTATONIC_MAJOR")
 * into { tonic, quality } where tonic is bare ("C#", "Bb") and quality is
 * the enum id ("PENTATONIC_MAJOR").
 */
export function parseScaleName(str) {
  const idx = str.indexOf(' ');
  return {
    tonic: str.slice(0, idx),
    quality: str.slice(idx + 1),
  };
}
