import { Chord } from '../chord'
import { PitchClass } from '../pitch-class'

/**
 * Finds augmented triads that connect two chords.
 * An augmented triad connects two chords if it shares at least one note
 * with each. Only 4 distinct augmented triads exist.
 */
export class AugmentedConnectionsTool {
  /** Find augmented triads connecting source and target chords. */
  compute(source: Chord, target: Chord): Chord[] {
    const seen = new Set<string>()
    const connections: Chord[] = []

    for (let root = 0; root < 12; root++) {
      const aug = new Chord(new PitchClass(root), 'augmented')

      const key = [...aug.pitchClasses].map(p => p.value).sort((a, b) => a - b).join(',')
      if (seen.has(key)) continue
      seen.add(key)

      const sharedWithSource = PitchClass.sharedNotes(
        [...aug.pitchClasses], [...source.pitchClasses],
      )
      const sharedWithTarget = PitchClass.sharedNotes(
        [...aug.pitchClasses], [...target.pitchClasses],
      )

      if (sharedWithSource.length >= 1 && sharedWithTarget.length >= 1) {
        connections.push(aug)
      }
    }

    return connections
  }

  /**
   * Given an augmented triad, find all major and minor triads reachable
   * by moving one note by ±1 semitone.
   */
  reachableTriads(aug: Chord): Chord[] {
    const results: Chord[] = []
    const notes = [...aug.pitchClasses]

    for (let i = 0; i < notes.length; i++) {
      for (const delta of [-1, 1]) {
        const modified = notes.map((n, j) =>
          j === i ? n.transpose(delta) : n,
        )
        // Check if this forms a known major or minor triad
        const triad = this.identifyTriad(modified)
        if (triad && !results.some(r => r.equals(triad))) {
          results.push(triad)
        }
      }
    }

    return results
  }

  private identifyTriad(notes: PitchClass[]): Chord | null {
    // Try each note as potential root for major/minor triads
    for (const quality of ['major', 'minor'] as const) {
      for (let root = 0; root < 12; root++) {
        const candidate = new Chord(new PitchClass(root), quality)
        const candidateValues = new Set(candidate.pitchClasses.map(p => p.value))
        const noteValues = new Set(notes.map(p => p.value))
        if (
          candidateValues.size === noteValues.size &&
          [...candidateValues].every(v => noteValues.has(v))
        ) {
          return candidate
        }
      }
    }
    return null
  }
}
