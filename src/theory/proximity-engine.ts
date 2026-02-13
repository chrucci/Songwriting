import { Chord } from './chord'
import { PitchClass } from './pitch-class'

/** Proximity levels based on shared-note count with the tonic. */
export type ProximityLevel = 'close' | 'medium' | 'far'

/** A chord annotated with its proximity to the tonic. */
export interface RankedChord {
  chord: Chord
  sharedNoteCount: number
  sharedNotes: PitchClass[]
  proximity: ProximityLevel
}

/**
 * Ranks chords by their harmonic proximity to a tonic chord.
 * Proximity is determined by counting shared pitch classes.
 *
 * Single Responsibility: only computes proximity rankings.
 */
export class ProximityEngine {
  /** Compute the proximity of a single chord relative to a tonic. */
  computeProximity(tonic: Chord, candidate: Chord): RankedChord {
    const shared = PitchClass.sharedNotes(
      [...tonic.pitchClasses],
      [...candidate.pitchClasses],
    )
    const count = shared.length
    const proximity: ProximityLevel =
      count >= 2 ? 'close' :
      count === 1 ? 'medium' : 'far'

    return {
      chord: candidate,
      sharedNoteCount: count,
      sharedNotes: shared,
      proximity,
    }
  }

  /** Rank all candidate chords by proximity to the tonic (descending). */
  rankAll(tonic: Chord, candidates: Chord[]): RankedChord[] {
    return candidates
      .filter(c => !c.equals(tonic))
      .map(c => this.computeProximity(tonic, c))
      .sort((a, b) => b.sharedNoteCount - a.sharedNoteCount)
  }

  /** Group ranked chords into close, medium, and far buckets. */
  groupByProximity(ranked: RankedChord[]): Record<ProximityLevel, RankedChord[]> {
    return {
      close: ranked.filter(r => r.proximity === 'close'),
      medium: ranked.filter(r => r.proximity === 'medium'),
      far: ranked.filter(r => r.proximity === 'far'),
    }
  }
}
