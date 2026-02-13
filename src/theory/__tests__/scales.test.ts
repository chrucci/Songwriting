import { describe, it, expect } from 'vitest'
import { Scale } from '../scales'
import { PitchClass } from '../pitch-class'

describe('Scale', () => {
  describe('major scale', () => {
    it('generates C major scale notes', () => {
      const scale = Scale.major(0)
      expect(scale.degrees.map(p => p.value)).toEqual([0, 2, 4, 5, 7, 9, 11])
    })

    it('generates G major scale notes', () => {
      const scale = Scale.major(7)
      expect(scale.degrees.map(p => p.value)).toEqual([7, 9, 11, 0, 2, 4, 6])
    })

    it('generates F major scale notes', () => {
      const scale = Scale.major(5)
      expect(scale.degrees.map(p => p.value)).toEqual([5, 7, 9, 10, 0, 2, 4])
    })
  })

  describe('minor scale', () => {
    it('generates A minor scale notes', () => {
      const scale = Scale.minor(9)
      expect(scale.degrees.map(p => p.value)).toEqual([9, 11, 0, 2, 4, 5, 7])
    })

    it('generates E minor scale notes', () => {
      const scale = Scale.minor(4)
      expect(scale.degrees.map(p => p.value)).toEqual([4, 6, 7, 9, 11, 0, 2])
    })
  })

  describe('contains', () => {
    it('recognizes notes in C major scale', () => {
      const cMajor = Scale.major(0)
      expect(cMajor.contains(new PitchClass(0))).toBe(true)  // C
      expect(cMajor.contains(new PitchClass(4))).toBe(true)  // E
      expect(cMajor.contains(new PitchClass(7))).toBe(true)  // G
    })

    it('rejects notes not in C major scale', () => {
      const cMajor = Scale.major(0)
      expect(cMajor.contains(new PitchClass(1))).toBe(false)  // C#
      expect(cMajor.contains(new PitchClass(6))).toBe(false)  // F#
    })
  })

  describe('degreeOf', () => {
    it('returns 1-indexed scale degree', () => {
      const cMajor = Scale.major(0)
      expect(cMajor.degreeOf(new PitchClass(0))).toBe(1) // C = 1st degree
      expect(cMajor.degreeOf(new PitchClass(2))).toBe(2) // D = 2nd degree
      expect(cMajor.degreeOf(new PitchClass(7))).toBe(5) // G = 5th degree
    })

    it('returns -1 for notes not in the scale', () => {
      const cMajor = Scale.major(0)
      expect(cMajor.degreeOf(new PitchClass(1))).toBe(-1)
    })
  })

  describe('preferFlats', () => {
    it('returns true for flat keys', () => {
      expect(Scale.major(5).preferFlats).toBe(true)   // F major
      expect(Scale.major(10).preferFlats).toBe(true)  // Bb major
      expect(Scale.major(3).preferFlats).toBe(true)   // Eb major
    })

    it('returns false for sharp keys', () => {
      expect(Scale.major(0).preferFlats).toBe(false)   // C major
      expect(Scale.major(7).preferFlats).toBe(false)   // G major
      expect(Scale.major(2).preferFlats).toBe(false)   // D major
    })
  })
})
