import { describe, it, expect } from 'vitest'
import { ClassicalFunctionAnalyzer } from '../classical-function-analyzer'
import { Chord } from '../chord'
import { PitchClass } from '../pitch-class'

function chord(root: number, quality: 'major' | 'minor' | 'diminished' | 'dom7' = 'major'): Chord {
  return new Chord(new PitchClass(root), quality)
}

describe('ClassicalFunctionAnalyzer', () => {
  const analyzer = new ClassicalFunctionAnalyzer()

  describe('C major key', () => {
    it('labels I (C major) as Tonic', () => {
      const result = analyzer.analyze(chord(0, 'major'), 0, 'major')
      expect(result.func).toBe('T')
      expect(result.romanNumeral).toBe('I')
    })

    it('labels ii (D minor) as Subdominant', () => {
      const result = analyzer.analyze(chord(2, 'minor'), 0, 'major')
      expect(result.func).toBe('S')
      expect(result.romanNumeral).toBe('ii')
    })

    it('labels iii (E minor) as Tonic', () => {
      const result = analyzer.analyze(chord(4, 'minor'), 0, 'major')
      expect(result.func).toBe('T')
      expect(result.romanNumeral).toBe('iii')
    })

    it('labels IV (F major) as Subdominant', () => {
      const result = analyzer.analyze(chord(5, 'major'), 0, 'major')
      expect(result.func).toBe('S')
      expect(result.romanNumeral).toBe('IV')
    })

    it('labels V (G major) as Dominant', () => {
      const result = analyzer.analyze(chord(7, 'major'), 0, 'major')
      expect(result.func).toBe('D')
      expect(result.romanNumeral).toBe('V')
    })

    it('labels vi (A minor) as Tonic', () => {
      const result = analyzer.analyze(chord(9, 'minor'), 0, 'major')
      expect(result.func).toBe('T')
      expect(result.romanNumeral).toBe('vi')
    })

    it('labels vii° (B diminished) as Dominant', () => {
      const result = analyzer.analyze(chord(11, 'diminished'), 0, 'major')
      expect(result.func).toBe('D')
      expect(result.romanNumeral).toBe('vii\u00B0')
    })
  })

  describe('G major key', () => {
    it('labels I (G major) as Tonic', () => {
      const result = analyzer.analyze(chord(7, 'major'), 7, 'major')
      expect(result.func).toBe('T')
      expect(result.romanNumeral).toBe('I')
    })

    it('labels V (D major) as Dominant', () => {
      const result = analyzer.analyze(chord(2, 'major'), 7, 'major')
      expect(result.func).toBe('D')
      expect(result.romanNumeral).toBe('V')
    })
  })

  describe('A minor key', () => {
    it('labels i (A minor) as Tonic', () => {
      const result = analyzer.analyze(chord(9, 'minor'), 9, 'minor')
      expect(result.func).toBe('T')
      expect(result.romanNumeral).toBe('i')
    })

    it('labels V (E major) as Dominant', () => {
      const result = analyzer.analyze(chord(4, 'major'), 9, 'minor')
      expect(result.func).toBe('D')
      expect(result.romanNumeral).toBe('V')
    })

    it('labels iv (D minor) as Subdominant', () => {
      const result = analyzer.analyze(chord(2, 'minor'), 9, 'minor')
      expect(result.func).toBe('S')
      expect(result.romanNumeral).toBe('iv')
    })
  })

  describe('chromatic chords', () => {
    it('assigns function to non-diatonic chords via shared-note analysis', () => {
      // Db major in C major — chromatic chord
      const result = analyzer.analyze(chord(1, 'major'), 0, 'major')
      // Should still get a function assignment
      expect(['T', 'S', 'D']).toContain(result.func)
    })
  })
})
