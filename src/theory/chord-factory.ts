import { PitchClass } from './pitch-class'
import { Chord } from './chord'
import type { ChordQuality } from './chord'
import { MAJOR_SCALE_INTERVALS, MINOR_SCALE_INTERVALS } from './constants'

/** Triad quality pattern for major scale degrees (I through vii). */
const MAJOR_TRIAD_QUALITIES: ChordQuality[] = [
  'major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished',
]

/** Triad quality pattern for natural minor scale degrees (i through VII). */
const MINOR_TRIAD_QUALITIES: ChordQuality[] = [
  'minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major',
]

/** Seventh chord quality pattern for major scale degrees (Imaj7 through viim7b5). */
const MAJOR_SEVENTH_QUALITIES: ChordQuality[] = [
  'maj7', 'min7', 'min7', 'maj7', 'dom7', 'min7', 'min7b5',
]

/** Seventh chord quality pattern for natural minor scale degrees (im7 through VIIdom7). */
const MINOR_SEVENTH_QUALITIES: ChordQuality[] = [
  'min7', 'min7b5', 'maj7', 'min7', 'min7', 'maj7', 'dom7',
]

const TRIAD_QUALITIES: ChordQuality[] = ['major', 'minor']
const SEVENTH_QUALITIES: ChordQuality[] = ['dom7', 'maj7', 'min7', 'dim7', 'min7b5']
const ALL_QUALITIES: ChordQuality[] = [
  'major', 'minor', 'diminished', 'augmented',
  'dom7', 'maj7', 'min7', 'dim7', 'min7b5',
]

/**
 * Factory for generating collections of chords.
 * Follows the Factory Method pattern — static methods produce chord instances.
 */
export class ChordFactory {
  /** Generate all 24 major + minor triads (12 roots x 2 qualities). */
  static allTriads(): Chord[] {
    return ChordFactory.generateForQualities(TRIAD_QUALITIES)
  }

  /** Generate all 60 seventh chords (12 roots x 5 qualities). */
  static allSevenths(): Chord[] {
    return ChordFactory.generateForQualities(SEVENTH_QUALITIES)
  }

  /** Generate all chords across all qualities. */
  static allChords(): Chord[] {
    return ChordFactory.generateForQualities(ALL_QUALITIES)
  }

  /** Generate the 7 diatonic triads for a given key and mode. */
  static diatonicTriads(root: number, mode: 'major' | 'minor'): Chord[] {
    const intervals = mode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS
    const qualities = mode === 'major' ? MAJOR_TRIAD_QUALITIES : MINOR_TRIAD_QUALITIES

    return intervals.map((interval, i) => {
      const scaleRoot = new PitchClass(root + interval)
      return new Chord(scaleRoot, qualities[i])
    })
  }

  /** Generate the 7 diatonic seventh chords for a given key and mode. */
  static diatonicSevenths(root: number, mode: 'major' | 'minor'): Chord[] {
    const intervals = mode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS
    const qualities = mode === 'major' ? MAJOR_SEVENTH_QUALITIES : MINOR_SEVENTH_QUALITIES

    return intervals.map((interval, i) => {
      const scaleRoot = new PitchClass(root + interval)
      return new Chord(scaleRoot, qualities[i])
    })
  }

  private static generateForQualities(qualities: ChordQuality[]): Chord[] {
    const chords: Chord[] = []
    for (let rootValue = 0; rootValue < 12; rootValue++) {
      const root = new PitchClass(rootValue)
      for (const quality of qualities) {
        chords.push(new Chord(root, quality))
      }
    }
    return chords
  }
}
