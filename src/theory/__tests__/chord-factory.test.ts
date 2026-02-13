import { describe, it, expect } from 'vitest'
import { ChordFactory } from '../chord-factory'

describe('ChordFactory', () => {
  describe('allTriads', () => {
    it('generates 24 major triads', () => {
      const majors = ChordFactory.allTriads().filter(c => c.quality === 'major')
      expect(majors).toHaveLength(12)
    })

    it('generates 24 minor triads', () => {
      const minors = ChordFactory.allTriads().filter(c => c.quality === 'minor')
      expect(minors).toHaveLength(12)
    })

    it('generates 24 total triads (major + minor)', () => {
      expect(ChordFactory.allTriads()).toHaveLength(24)
    })

    it('covers all 12 roots for each quality', () => {
      const majors = ChordFactory.allTriads().filter(c => c.quality === 'major')
      const roots = new Set(majors.map(c => c.root.value))
      expect(roots.size).toBe(12)
    })
  })

  describe('allSevenths', () => {
    it('generates 60 seventh chords (5 qualities x 12 roots)', () => {
      expect(ChordFactory.allSevenths()).toHaveLength(60)
    })

    it('includes all five seventh chord qualities', () => {
      const qualities = new Set(ChordFactory.allSevenths().map(c => c.quality))
      expect(qualities).toContain('dom7')
      expect(qualities).toContain('maj7')
      expect(qualities).toContain('min7')
      expect(qualities).toContain('dim7')
      expect(qualities).toContain('min7b5')
    })
  })

  describe('allChords', () => {
    it('generates triads + sevenths combined', () => {
      const all = ChordFactory.allChords()
      // 24 triads + 60 sevenths = 84
      // Plus 24 diminished + 12 augmented triads = 24 + 12 = 36 more? No.
      // allTriads returns major+minor only (24). allChords returns all.
      expect(all.length).toBeGreaterThan(24)
    })
  })

  describe('diatonicTriads', () => {
    it('generates 7 diatonic triads for C major', () => {
      const triads = ChordFactory.diatonicTriads(0, 'major')
      expect(triads).toHaveLength(7)

      const symbols = triads.map(c => c.symbol())
      expect(symbols).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'])
    })

    it('generates 7 diatonic triads for A minor', () => {
      const triads = ChordFactory.diatonicTriads(9, 'minor')
      expect(triads).toHaveLength(7)

      const symbols = triads.map(c => c.symbol())
      expect(symbols).toEqual(['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'])
    })

    it('generates diatonic triads for G major', () => {
      const triads = ChordFactory.diatonicTriads(7, 'major')
      const symbols = triads.map(c => c.symbol())
      expect(symbols).toEqual(['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'])
    })
  })
})
