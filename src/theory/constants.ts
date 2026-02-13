/** The 12 pitch class names using sharps */
export const NOTE_NAMES_SHARP = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const

/** The 12 pitch class names using flats */
export const NOTE_NAMES_FLAT = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
] as const

/** Keys that conventionally use flat spellings */
export const FLAT_KEY_ROOTS = new Set([1, 3, 5, 8, 10]) // Db, Eb, F, Ab, Bb

/** Interval names by semitone count */
export const INTERVALS = {
  UNISON: 0,
  MINOR_2ND: 1,
  MAJOR_2ND: 2,
  MINOR_3RD: 3,
  MAJOR_3RD: 4,
  PERFECT_4TH: 5,
  TRITONE: 6,
  PERFECT_5TH: 7,
  MINOR_6TH: 8,
  MAJOR_6TH: 9,
  MINOR_7TH: 10,
  MAJOR_7TH: 11,
} as const

/** Major scale intervals (whole-whole-half-whole-whole-whole-half) */
export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const

/** Natural minor scale intervals */
export const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10] as const
