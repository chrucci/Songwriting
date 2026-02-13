import { PitchClass } from './pitch-class'

/** Supported chord qualities. */
export type ChordQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'dom7'
  | 'maj7'
  | 'min7'
  | 'dim7'
  | 'min7b5'

/** Interval templates (semitones from root) for each chord quality. */
const CHORD_INTERVALS: Record<ChordQuality, readonly number[]> = {
  major:      [0, 4, 7],
  minor:      [0, 3, 7],
  diminished: [0, 3, 6],
  augmented:  [0, 4, 8],
  dom7:       [0, 4, 7, 10],
  maj7:       [0, 4, 7, 11],
  min7:       [0, 3, 7, 10],
  dim7:       [0, 3, 6, 9],
  min7b5:     [0, 3, 6, 10],
}

/** Suffix appended to root name when displaying the chord symbol. */
const QUALITY_SUFFIX: Record<ChordQuality, string> = {
  major:      '',
  minor:      'm',
  diminished: 'dim',
  augmented:  'aug',
  dom7:       '7',
  maj7:       'maj7',
  min7:       'm7',
  dim7:       'dim7',
  min7b5:     'm7b5',
}

const TRIAD_QUALITIES: ReadonlySet<ChordQuality> = new Set([
  'major', 'minor', 'diminished', 'augmented',
])

/**
 * Immutable chord model.
 * Consists of a root pitch class, a quality, and derived pitch classes.
 */
export class Chord {
  readonly root: PitchClass
  readonly quality: ChordQuality
  readonly pitchClasses: readonly PitchClass[]

  constructor(root: PitchClass, quality: ChordQuality) {
    this.root = root
    this.quality = quality
    this.pitchClasses = CHORD_INTERVALS[quality].map(
      interval => root.transpose(interval)
    )
  }

  /** Get the chord symbol string (e.g., "Am7", "Db", "G7"). */
  symbol(preferFlats = false): string {
    return this.root.name(preferFlats) + QUALITY_SUFFIX[this.quality]
  }

  /** Check if this chord equals another by root and quality. */
  equals(other: Chord): boolean {
    return this.root.equals(other.root) && this.quality === other.quality
  }

  /** Whether this chord is a triad (3 notes). */
  isTriad(): boolean {
    return TRIAD_QUALITIES.has(this.quality)
  }

  /** Whether this chord is a seventh chord (4 notes). */
  isSeventh(): boolean {
    return !TRIAD_QUALITIES.has(this.quality)
  }
}
