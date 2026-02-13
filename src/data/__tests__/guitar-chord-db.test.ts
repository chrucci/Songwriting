import { describe, it, expect } from 'vitest'
import { GuitarChordDB } from '../guitar-chord-db'
import type { ChordQuality } from '../../theory/chord'

describe('GuitarChordDB', () => {
  const db = new GuitarChordDB()

  describe('getVoicings', () => {
    it('returns voicings for C major', () => {
      const voicings = db.getVoicings(0, 'major')
      expect(voicings.length).toBeGreaterThan(0)
      expect(voicings[0].label).toBe('Open')
    })

    it('returns voicings for A minor', () => {
      const voicings = db.getVoicings(9, 'minor')
      expect(voicings.length).toBeGreaterThan(0)
      expect(voicings[0].label).toBe('Open')
    })

    it('returns voicings for E major', () => {
      const voicings = db.getVoicings(4, 'major')
      expect(voicings.length).toBe(1)
      expect(voicings[0].label).toBe('Open')
    })

    it('returns barre voicings for F major', () => {
      const voicings = db.getVoicings(5, 'major')
      expect(voicings.length).toBe(1)
      expect(voicings[0].label).toContain('Barre')
      expect(voicings[0].barres.length).toBeGreaterThan(0)
    })

    it('returns empty array for unknown quality', () => {
      const voicings = db.getVoicings(0, 'dim7' as ChordQuality)
      expect(voicings).toEqual([])
    })

    it('normalizes pitch class values', () => {
      const voicings = db.getVoicings(12, 'major') // 12 = C
      expect(voicings.length).toBeGreaterThan(0)
    })

    it('handles negative pitch class values', () => {
      const voicings = db.getVoicings(-3, 'major') // -3 = 9 = A
      expect(voicings.length).toBeGreaterThan(0)
    })
  })

  describe('hasVoicing', () => {
    it('returns true for available chord', () => {
      expect(db.hasVoicing(0, 'major')).toBe(true)
    })

    it('returns false for unavailable chord', () => {
      expect(db.hasVoicing(0, 'dim7')).toBe(false)
    })
  })

  describe('getDefaultVoicing', () => {
    it('returns first voicing for available chord', () => {
      const voicing = db.getDefaultVoicing(7, 'major') // G major
      expect(voicing).not.toBeNull()
      expect(voicing!.label).toBe('Open')
    })

    it('returns null for unavailable chord', () => {
      const voicing = db.getDefaultVoicing(0, 'dim7')
      expect(voicing).toBeNull()
    })
  })

  describe('voicingCount', () => {
    it('returns correct count for chords with multiple voicings', () => {
      const count = db.voicingCount(0, 'major') // C major has 2
      expect(count).toBe(2)
    })

    it('returns 0 for unavailable chords', () => {
      const count = db.voicingCount(0, 'dim7')
      expect(count).toBe(0)
    })
  })

  describe('voicing data integrity', () => {
    const allQualities: ChordQuality[] = ['major', 'minor', 'dom7', 'maj7', 'min7']

    it('all 12 keys have major voicings', () => {
      for (let pc = 0; pc < 12; pc++) {
        const voicings = db.getVoicings(pc, 'major')
        expect(voicings.length, `No major voicing for pc=${pc}`).toBeGreaterThan(0)
      }
    })

    it('all 12 keys have minor voicings', () => {
      for (let pc = 0; pc < 12; pc++) {
        const voicings = db.getVoicings(pc, 'minor')
        expect(voicings.length, `No minor voicing for pc=${pc}`).toBeGreaterThan(0)
      }
    })

    it('all voicings have valid finger arrays with 6 entries', () => {
      for (let pc = 0; pc < 12; pc++) {
        for (const quality of allQualities) {
          const voicings = db.getVoicings(pc, quality)
          for (const v of voicings) {
            expect(v.fingers.length, `pc=${pc} ${quality} ${v.label}`).toBe(6)
          }
        }
      }
    })

    it('all voicings have valid position >= 1', () => {
      for (let pc = 0; pc < 12; pc++) {
        for (const quality of allQualities) {
          const voicings = db.getVoicings(pc, quality)
          for (const v of voicings) {
            expect(v.position, `pc=${pc} ${quality} ${v.label}`).toBeGreaterThanOrEqual(1)
          }
        }
      }
    })

    it('all finger entries have valid string numbers (1-6)', () => {
      for (let pc = 0; pc < 12; pc++) {
        for (const quality of allQualities) {
          const voicings = db.getVoicings(pc, quality)
          for (const v of voicings) {
            for (const finger of v.fingers) {
              expect(finger[0], `pc=${pc} ${quality} ${v.label}`).toBeGreaterThanOrEqual(1)
              expect(finger[0], `pc=${pc} ${quality} ${v.label}`).toBeLessThanOrEqual(6)
            }
          }
        }
      }
    })

    it('all barre chords have valid string ranges', () => {
      for (let pc = 0; pc < 12; pc++) {
        for (const quality of allQualities) {
          const voicings = db.getVoicings(pc, quality)
          for (const v of voicings) {
            for (const barre of v.barres) {
              expect(barre.fromString).toBeGreaterThanOrEqual(1)
              expect(barre.toString).toBeGreaterThanOrEqual(1)
              expect(barre.fromString).toBeLessThanOrEqual(6)
              expect(barre.toString).toBeLessThanOrEqual(6)
              expect(barre.fret).toBeGreaterThanOrEqual(1)
            }
          }
        }
      }
    })
  })
})
