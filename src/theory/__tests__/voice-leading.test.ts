import { describe, it, expect } from 'vitest'
import { VoiceLeadingAnalyzer } from '../voice-leading'
import { Chord } from '../chord'
import { PitchClass } from '../pitch-class'

function chord(root: number, quality: 'major' | 'minor' = 'major'): Chord {
  return new Chord(new PitchClass(root), quality)
}

describe('VoiceLeadingAnalyzer', () => {
  const analyzer = new VoiceLeadingAnalyzer()

  describe('analyze', () => {
    it('finds 2 shared notes between C major and Am', () => {
      // C(0,4,7) -> Am(9,0,4): shares C(0) and E(4)
      const result = analyzer.analyze(chord(0), chord(9, 'minor'))
      expect(result.sharedNoteCount).toBe(2)
      expect(result.isSmooth).toBe(true)
      expect(result.sharedNotes.map(p => p.value).sort()).toEqual([0, 4])
    })

    it('finds 1 shared note between C major and F major', () => {
      // C(0,4,7) -> F(5,9,0): shares C(0)
      const result = analyzer.analyze(chord(0), chord(5))
      expect(result.sharedNoteCount).toBe(1)
      expect(result.isSmooth).toBe(true)
    })

    it('flags 0 shared notes between C major and F#m', () => {
      // C(0,4,7) -> F#m(6,9,1): shares nothing
      const result = analyzer.analyze(chord(0), chord(6, 'minor'))
      expect(result.sharedNoteCount).toBe(0)
      expect(result.isSmooth).toBe(false)
    })
  })

  describe('analyzeProgression', () => {
    it('returns n-1 results for n chords', () => {
      const chords = [chord(0), chord(5), chord(7), chord(0)]
      const results = analyzer.analyzeProgression(chords)
      expect(results).toHaveLength(3)
    })

    it('analyzes I-IV-V-I in C major correctly', () => {
      const chords = [chord(0), chord(5), chord(7), chord(0)]
      const results = analyzer.analyzeProgression(chords)
      // C->F: share C(0)
      expect(results[0].sharedNoteCount).toBe(1)
      // F->G: share nothing (F(5,9,0) vs G(7,11,2))
      expect(results[1].sharedNoteCount).toBe(0)
      // G->C: share G(7)
      expect(results[2].sharedNoteCount).toBe(1)
    })

    it('returns empty for single chord', () => {
      expect(analyzer.analyzeProgression([chord(0)])).toEqual([])
    })

    it('returns empty for no chords', () => {
      expect(analyzer.analyzeProgression([])).toEqual([])
    })
  })
})
