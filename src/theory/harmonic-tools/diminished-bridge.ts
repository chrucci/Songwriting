import { Chord } from '../chord'
import { PitchClass } from '../pitch-class'

/**
 * Finds diminished 7th chords that can bridge between two chords.
 * A dim7 bridge shares at least one note with each chord.
 * Since there are only 3 distinct dim7 chords (each repeats every 3 semitones),
 * results are deduplicated by pitch class set.
 */
export class DiminishedBridgeTool {
  compute(source: Chord, target: Chord): Chord[] {
    const seen = new Set<string>()
    const bridges: Chord[] = []

    for (let root = 0; root < 12; root++) {
      const dim = new Chord(new PitchClass(root), 'dim7')

      // Create a canonical key for deduplication (sorted pitch classes)
      const key = [...dim.pitchClasses].map(p => p.value).sort((a, b) => a - b).join(',')
      if (seen.has(key)) continue
      seen.add(key)

      const sharedWithSource = PitchClass.sharedNotes(
        [...dim.pitchClasses], [...source.pitchClasses],
      )
      const sharedWithTarget = PitchClass.sharedNotes(
        [...dim.pitchClasses], [...target.pitchClasses],
      )

      if (sharedWithSource.length >= 1 && sharedWithTarget.length >= 1) {
        bridges.push(dim)
      }
    }

    return bridges
  }
}
