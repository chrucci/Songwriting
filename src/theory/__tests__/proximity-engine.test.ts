import { describe, it, expect } from 'vitest'
import { ProximityEngine } from '../proximity-engine'
import { Chord } from '../chord'
import { PitchClass } from '../pitch-class'

function chord(rootValue: number, quality: 'major' | 'minor' | 'dom7' = 'major'): Chord {
  return new Chord(new PitchClass(rootValue), quality)
}

describe('ProximityEngine', () => {
  const engine = new ProximityEngine()
  const cMajorTonic = chord(0, 'major') // C major: C(0) E(4) G(7)

  describe('computeProximity', () => {
    it('returns "close" (2 shared notes) for Am relative to C major', () => {
      // Am = A(9) C(0) E(4) — shares C and E with C major
      const result = engine.computeProximity(cMajorTonic, chord(9, 'minor'))
      expect(result.proximity).toBe('close')
      expect(result.sharedNoteCount).toBe(2)
      expect(result.sharedNotes.map(p => p.value).sort()).toEqual([0, 4])
    })

    it('returns "close" (2 shared notes) for Em relative to C major', () => {
      // Em = E(4) G(7) B(11) — shares E and G with C major
      const result = engine.computeProximity(cMajorTonic, chord(4, 'minor'))
      expect(result.proximity).toBe('close')
      expect(result.sharedNoteCount).toBe(2)
    })

    it('returns "medium" (1 shared note) for F major relative to C major', () => {
      // F = F(5) A(9) C(0) — shares C with C major
      const result = engine.computeProximity(cMajorTonic, chord(5, 'major'))
      expect(result.proximity).toBe('medium')
      expect(result.sharedNoteCount).toBe(1)
    })

    it('returns "medium" (1 shared note) for G major relative to C major', () => {
      // G = G(7) B(11) D(2) — shares G with C major
      const result = engine.computeProximity(cMajorTonic, chord(7, 'major'))
      expect(result.proximity).toBe('medium')
      expect(result.sharedNoteCount).toBe(1)
    })

    it('returns "far" (0 shared notes) for Dm relative to C major', () => {
      // Dm = D(2) F(5) A(9) — shares nothing with C(0) E(4) G(7)
      const result = engine.computeProximity(cMajorTonic, chord(2, 'minor'))
      expect(result.proximity).toBe('far')
      expect(result.sharedNoteCount).toBe(0)
    })

    it('returns "far" (0 shared notes) for F#m relative to C major', () => {
      // F#m = F#(6) A(9) C#(1) — shares nothing with C E G
      const result = engine.computeProximity(cMajorTonic, chord(6, 'minor'))
      expect(result.proximity).toBe('far')
      expect(result.sharedNoteCount).toBe(0)
    })
  })

  describe('rankAll', () => {
    it('excludes the tonic chord from results', () => {
      const candidates = [cMajorTonic, chord(9, 'minor'), chord(2, 'major')]
      const ranked = engine.rankAll(cMajorTonic, candidates)
      expect(ranked.find(r => r.chord.equals(cMajorTonic))).toBeUndefined()
    })

    it('sorts by shared note count descending', () => {
      const candidates = [
        chord(6, 'minor'), // 0 shared — far
        chord(5, 'major'), // 1 shared — medium
        chord(9, 'minor'), // 2 shared — close
      ]
      const ranked = engine.rankAll(cMajorTonic, candidates)
      expect(ranked[0].proximity).toBe('close')
      expect(ranked[1].proximity).toBe('medium')
      expect(ranked[2].proximity).toBe('far')
    })
  })

  describe('groupByProximity', () => {
    it('groups chords into close, medium, and far', () => {
      const candidates = [
        chord(9, 'minor'), // close
        chord(4, 'minor'), // close
        chord(5, 'major'), // medium
        chord(7, 'major'), // medium
        chord(6, 'minor'), // far
        chord(2, 'minor'), // far
      ]
      const ranked = engine.rankAll(cMajorTonic, candidates)
      const grouped = engine.groupByProximity(ranked)

      expect(grouped.close).toHaveLength(2)
      expect(grouped.medium).toHaveLength(2)
      expect(grouped.far).toHaveLength(2)
    })
  })

  describe('works with 7th chords', () => {
    it('computes proximity for dom7 against a triad tonic', () => {
      // G7 = G(7) B(11) D(2) F(5) — shares G(7) with C major triad
      const result = engine.computeProximity(cMajorTonic, chord(7, 'dom7'))
      expect(result.sharedNoteCount).toBe(1)
      expect(result.proximity).toBe('medium')
    })
  })
})
