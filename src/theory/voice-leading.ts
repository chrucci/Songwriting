import type { Chord } from './chord'
import { PitchClass } from './pitch-class'

/** Analysis of voice leading between two adjacent chords. */
export interface VoiceLeadingResult {
  sharedNotes: PitchClass[]
  sharedNoteCount: number
  isSmooth: boolean // true if at least 1 shared note
}

/**
 * Analyzes voice leading between adjacent chords in a progression.
 * Identifies shared notes and flags rough transitions (0 shared notes).
 */
export class VoiceLeadingAnalyzer {
  /** Analyze voice leading between two adjacent chords. */
  analyze(from: Chord, to: Chord): VoiceLeadingResult {
    const shared = PitchClass.sharedNotes(
      [...from.pitchClasses],
      [...to.pitchClasses],
    )
    return {
      sharedNotes: shared,
      sharedNoteCount: shared.length,
      isSmooth: shared.length > 0,
    }
  }

  /** Analyze voice leading across an entire progression. */
  analyzeProgression(chords: Chord[]): VoiceLeadingResult[] {
    const results: VoiceLeadingResult[] = []
    for (let i = 0; i < chords.length - 1; i++) {
      results.push(this.analyze(chords[i], chords[i + 1]))
    }
    return results
  }
}
