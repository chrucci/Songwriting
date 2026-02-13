import { describe, it, expect } from 'vitest'
import { SyntacticalFunctionAnalyzer } from '../syntactical-function-analyzer'
import { Chord } from '../chord'
import { PitchClass } from '../pitch-class'

function chord(root: number, quality: 'major' | 'minor' = 'major'): Chord {
  return new Chord(new PitchClass(root), quality)
}

describe('SyntacticalFunctionAnalyzer', () => {
  const analyzer = new SyntacticalFunctionAnalyzer()

  describe('4-chord section (standard T-S-D-T circuit)', () => {
    const chords = [
      chord(0), // C
      chord(5), // F
      chord(7), // G
      chord(0), // C
    ]

    it('assigns T-opening to first chord', () => {
      const result = analyzer.analyzeSection(chords, 0, 'major')
      expect(result[0].role).toBe('T-opening')
    })

    it('assigns S-transitional to second chord', () => {
      const result = analyzer.analyzeSection(chords, 0, 'major')
      expect(result[1].role).toBe('S-transitional')
    })

    it('assigns D-penultimate to third chord', () => {
      const result = analyzer.analyzeSection(chords, 0, 'major')
      expect(result[2].role).toBe('D-penultimate')
    })

    it('assigns T-closing to last chord', () => {
      const result = analyzer.analyzeSection(chords, 0, 'major')
      expect(result[3].role).toBe('T-closing')
    })
  })

  describe('2-chord section', () => {
    const chords = [chord(7), chord(0)] // G -> C

    it('assigns T-opening and T-closing', () => {
      const result = analyzer.analyzeSection(chords, 0, 'major')
      expect(result[0].role).toBe('T-opening')
      expect(result[1].role).toBe('T-closing')
    })
  })

  describe('1-chord section', () => {
    it('assigns T-opening to the single chord', () => {
      const result = analyzer.analyzeSection([chord(0)], 0, 'major')
      expect(result[0].role).toBe('T-opening')
    })
  })

  describe('6-chord section', () => {
    const chords = [
      chord(0), chord(9, 'minor'), chord(5), chord(2, 'minor'), chord(7), chord(0),
    ]

    it('assigns roles correctly across longer section', () => {
      const result = analyzer.analyzeSection(chords, 0, 'major')
      expect(result[0].role).toBe('T-opening')
      expect(result[1].role).toBe('S-transitional')
      expect(result[2].role).toBe('S-transitional')
      expect(result[3].role).toBe('S-transitional')
      expect(result[4].role).toBe('D-penultimate')
      expect(result[5].role).toBe('T-closing')
    })
  })

  describe('3-chord section', () => {
    const chords = [chord(0), chord(7), chord(0)]

    it('assigns T-S/D-T pattern', () => {
      const result = analyzer.analyzeSection(chords, 0, 'major')
      expect(result[0].role).toBe('T-opening')
      expect(result[1].role).toBe('D-penultimate')
      expect(result[2].role).toBe('T-closing')
    })
  })
})
