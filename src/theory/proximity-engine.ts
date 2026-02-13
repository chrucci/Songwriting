import { Chord } from './chord'
import { PitchClass } from './pitch-class'

/** Proximity levels based on shared-note count with the tonic. */
export type ProximityLevel = 'tonic' | 'close' | 'medium' | 'far'

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
    if (candidate.equals(tonic)) {
      return {
        chord: candidate,
        sharedNoteCount: candidate.pitchClasses.length,
        sharedNotes: [...candidate.pitchClasses],
        proximity: 'tonic',
      }
    }

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

  /** Rank all candidate chords by proximity to the tonic (descending). Includes the tonic itself. */
  rankAll(tonic: Chord, candidates: Chord[]): RankedChord[] {
    return candidates
      .map(c => this.computeProximity(tonic, c))
      .sort((a, b) => b.sharedNoteCount - a.sharedNoteCount)
  }

  /** Group ranked chords into tonic, close, medium, and far buckets. */
  groupByProximity(ranked: RankedChord[]): Record<ProximityLevel, RankedChord[]> {
    return {
      tonic: ranked.filter(r => r.proximity === 'tonic'),
      close: ranked.filter(r => r.proximity === 'close'),
      medium: ranked.filter(r => r.proximity === 'medium'),
      far: ranked.filter(r => r.proximity === 'far'),
    }
  }
}
