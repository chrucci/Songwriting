import type { ChordQuality } from '../theory/chord'

/**
 * A guitar voicing definition.
 * - `fingers`: Array of [string, fret, options?] tuples (svguitar Finger format).
 *   String 1 = high E, string 6 = low E. Fret 0 = open, 'x' = muted.
 * - `barres`: Array of barre chord definitions.
 * - `position`: Starting fret position (defaults to 1).
 * - `label`: Human-readable voicing name (e.g., "Open", "Barre").
 */
export interface GuitarVoicing {
  fingers: [number, number | 0 | 'x', string?][]
  barres: { fromString: number; toString: number; fret: number }[]
  position: number
  label: string
}

/**
 * Pre-computed guitar voicings indexed by pitch class (0-11) and chord quality.
 *
 * Design: We store "template" voicings for open-position chords (C, A, G, E, D shapes)
 * and barre chord shapes. For keys without open voicings, we derive barre shapes
 * from the E and A shape templates.
 *
 * Each chord quality + root combination has 1-3 voicings available.
 */

// ── Open chord shapes (root pitch class → quality → voicings) ──

type VoicingMap = Partial<Record<ChordQuality, GuitarVoicing[]>>

const VOICINGS: Record<number, VoicingMap> = {
  // C (pitch class 0)
  0: {
    major: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 3], [6, 'x']],
        barres: [],
      },
      {
        label: 'Barre (A shape)',
        position: 3,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 3, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Am shape)',
        position: 3,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 3, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 1], [3, 3], [4, 2], [5, 3], [6, 'x']],
        barres: [],
      },
    ],
    maj7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 3], [6, 'x']],
        barres: [],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 3,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 4, fret: 1 }],
      },
    ],
  },

  // Db/C# (pitch class 1)
  1: {
    major: [
      {
        label: 'Barre (A shape)',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 3, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Am shape)',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 3, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Barre',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 1], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 2, fret: 1 }],
      },
    ],
    maj7: [
      {
        label: 'Barre',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 4, fret: 1 }],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 4, fret: 1 }],
      },
    ],
  },

  // D (pitch class 2)
  2: {
    major: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 2], [2, 3], [3, 2], [4, 0], [5, 'x'], [6, 'x']],
        barres: [],
      },
    ],
    minor: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 1], [2, 3], [3, 2], [4, 0], [5, 'x'], [6, 'x']],
        barres: [],
      },
    ],
    dom7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 2], [2, 1], [3, 2], [4, 0], [5, 'x'], [6, 'x']],
        barres: [],
      },
    ],
    maj7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 2], [2, 2], [3, 2], [4, 0], [5, 'x'], [6, 'x']],
        barres: [],
      },
    ],
    min7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 0], [5, 'x'], [6, 'x']],
        barres: [],
      },
    ],
    diminished: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 1], [2, 3], [3, 1], [4, 0], [5, 'x'], [6, 'x']],
        barres: [],
      },
    ],
    augmented: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 3], [2, 3], [3, 2], [4, 0], [5, 'x'], [6, 'x']],
        barres: [],
      },
    ],
  },

  // Eb/D# (pitch class 3)
  3: {
    major: [
      {
        label: 'Barre (A shape)',
        position: 6,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 3, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Am shape)',
        position: 6,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 3, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Barre',
        position: 6,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 1], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 2, fret: 1 }],
      },
    ],
    maj7: [
      {
        label: 'Barre',
        position: 6,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 4, fret: 1 }],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 6,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 'x']],
        barres: [{ fromString: 1, toString: 4, fret: 1 }],
      },
    ],
  },

  // E (pitch class 4)
  4: {
    major: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 0], [3, 1], [4, 2], [5, 2], [6, 0]],
        barres: [],
      },
    ],
    minor: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 0], [3, 0], [4, 2], [5, 2], [6, 0]],
        barres: [],
      },
    ],
    dom7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 3], [3, 1], [4, 0], [5, 2], [6, 0]],
        barres: [],
      },
    ],
    maj7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 0], [3, 1], [4, 1], [5, 2], [6, 0]],
        barres: [],
      },
    ],
    min7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 2], [6, 0]],
        barres: [],
      },
    ],
    diminished: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 'x'], [2, 2], [3, 0], [4, 2], [5, 1], [6, 'x']],
        barres: [],
      },
    ],
  },

  // F (pitch class 5)
  5: {
    major: [
      {
        label: 'Barre (E shape)',
        position: 1,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Em shape)',
        position: 1,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Barre',
        position: 1,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 1], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    maj7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 1], [3, 2], [4, 3], [5, 'x'], [6, 'x']],
        barres: [],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 1,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
  },

  // F#/Gb (pitch class 6)
  6: {
    major: [
      {
        label: 'Barre (E shape)',
        position: 2,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Em shape)',
        position: 2,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Barre',
        position: 2,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 1], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    maj7: [
      {
        label: 'Barre',
        position: 2,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 2], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 2, fret: 1 }],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 2,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
  },

  // G (pitch class 7)
  7: {
    major: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 3], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
        barres: [],
      },
      {
        label: 'Barre (E shape)',
        position: 3,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Em shape)',
        position: 3,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 1], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
        barres: [],
      },
    ],
    maj7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 2], [2, 0], [3, 0], [4, 0], [5, 2], [6, 3]],
        barres: [],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 3,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
  },

  // Ab/G# (pitch class 8)
  8: {
    major: [
      {
        label: 'Barre (E shape)',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Em shape)',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Barre',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 1], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    maj7: [
      {
        label: 'Barre',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 2], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 2, fret: 1 }],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 4,
        fingers: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
  },

  // A (pitch class 9)
  9: {
    major: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 2], [3, 2], [4, 2], [5, 0], [6, 'x']],
        barres: [],
      },
      {
        label: 'Barre (E shape)',
        position: 5,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 1], [3, 2], [4, 2], [5, 0], [6, 'x']],
        barres: [],
      },
    ],
    dom7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 2], [3, 0], [4, 2], [5, 0], [6, 'x']],
        barres: [],
      },
    ],
    maj7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 2], [3, 1], [4, 2], [5, 0], [6, 'x']],
        barres: [],
      },
    ],
    min7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 0], [2, 1], [3, 0], [4, 2], [5, 0], [6, 'x']],
        barres: [],
      },
    ],
    diminished: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 'x'], [2, 1], [3, 2], [4, 1], [5, 0], [6, 'x']],
        barres: [],
      },
    ],
    augmented: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 1], [2, 2], [3, 2], [4, 2], [5, 0], [6, 'x']],
        barres: [],
      },
    ],
  },

  // Bb/A# (pitch class 10)
  10: {
    major: [
      {
        label: 'Barre (A shape)',
        position: 1,
        fingers: [[1, 1], [2, 3], [3, 3], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Am shape)',
        position: 1,
        fingers: [[1, 1], [2, 2], [3, 3], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Barre',
        position: 1,
        fingers: [[1, 1], [2, 3], [3, 1], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
    ],
    maj7: [
      {
        label: 'Barre',
        position: 1,
        fingers: [[1, 1], [2, 3], [3, 2], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 1,
        fingers: [[1, 1], [2, 2], [3, 1], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
    ],
  },

  // B (pitch class 11)
  11: {
    major: [
      {
        label: 'Barre (A shape)',
        position: 2,
        fingers: [[1, 1], [2, 3], [3, 3], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
      {
        label: 'Barre (E shape)',
        position: 7,
        fingers: [[1, 1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 1]],
        barres: [{ fromString: 1, toString: 6, fret: 1 }],
      },
    ],
    minor: [
      {
        label: 'Barre (Am shape)',
        position: 2,
        fingers: [[1, 1], [2, 2], [3, 3], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
    ],
    dom7: [
      {
        label: 'Open',
        position: 1,
        fingers: [[1, 2], [2, 0], [3, 2], [4, 1], [5, 2], [6, 'x']],
        barres: [],
      },
    ],
    maj7: [
      {
        label: 'Barre',
        position: 2,
        fingers: [[1, 1], [2, 3], [3, 2], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
    ],
    min7: [
      {
        label: 'Barre',
        position: 2,
        fingers: [[1, 1], [2, 2], [3, 1], [4, 3], [5, 1], [6, 'x']],
        barres: [{ fromString: 1, toString: 5, fret: 1 }],
      },
    ],
    diminished: [
      {
        label: 'Barre',
        position: 1,
        fingers: [[1, 'x'], [2, 0], [3, 1], [4, 2], [5, 1], [6, 'x']],
        barres: [],
      },
    ],
  },
}

/**
 * Guitar chord voicing database.
 * Provides voicing lookups by pitch class and chord quality.
 */
export class GuitarChordDB {
  /** Get all voicings for a given root pitch class and quality. */
  getVoicings(rootPitchClass: number, quality: ChordQuality): GuitarVoicing[] {
    const normalized = ((rootPitchClass % 12) + 12) % 12
    const qualityVoicings = VOICINGS[normalized]?.[quality]
    return qualityVoicings ?? []
  }

  /** Check if any voicing exists for a given chord. */
  hasVoicing(rootPitchClass: number, quality: ChordQuality): boolean {
    return this.getVoicings(rootPitchClass, quality).length > 0
  }

  /** Get the first (default) voicing for a chord, or null if none exists. */
  getDefaultVoicing(rootPitchClass: number, quality: ChordQuality): GuitarVoicing | null {
    const voicings = this.getVoicings(rootPitchClass, quality)
    return voicings[0] ?? null
  }

  /** Get the number of available voicings for a chord. */
  voicingCount(rootPitchClass: number, quality: ChordQuality): number {
    return this.getVoicings(rootPitchClass, quality).length
  }
}
