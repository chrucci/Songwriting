import { describe, it, expect } from 'vitest'
import { Chord } from '../chord'
import { PitchClass } from '../pitch-class'

describe('Chord', () => {
  describe('construction', () => {
    it('creates a major triad with correct pitch classes', () => {
      const cMajor = new Chord(new PitchClass(0), 'major')
      expect(cMajor.pitchClasses.map(p => p.value)).toEqual([0, 4, 7]) // C E G
    })

    it('creates a minor triad with correct pitch classes', () => {
      const aMinor = new Chord(new PitchClass(9), 'minor')
      expect(aMinor.pitchClasses.map(p => p.value)).toEqual([9, 0, 4]) // A C E
    })

    it('creates a diminished triad', () => {
      const bDim = new Chord(new PitchClass(11), 'diminished')
      expect(bDim.pitchClasses.map(p => p.value)).toEqual([11, 2, 5]) // B D F
    })

    it('creates an augmented triad', () => {
      const cAug = new Chord(new PitchClass(0), 'augmented')
      expect(cAug.pitchClasses.map(p => p.value)).toEqual([0, 4, 8]) // C E G#
    })

    it('creates a dominant 7th chord', () => {
      const g7 = new Chord(new PitchClass(7), 'dom7')
      expect(g7.pitchClasses.map(p => p.value)).toEqual([7, 11, 2, 5]) // G B D F
    })

    it('creates a major 7th chord', () => {
      const cMaj7 = new Chord(new PitchClass(0), 'maj7')
      expect(cMaj7.pitchClasses.map(p => p.value)).toEqual([0, 4, 7, 11]) // C E G B
    })

    it('creates a minor 7th chord', () => {
      const dMin7 = new Chord(new PitchClass(2), 'min7')
      expect(dMin7.pitchClasses.map(p => p.value)).toEqual([2, 5, 9, 0]) // D F A C
    })

    it('creates a diminished 7th chord', () => {
      const bDim7 = new Chord(new PitchClass(11), 'dim7')
      expect(bDim7.pitchClasses.map(p => p.value)).toEqual([11, 2, 5, 8]) // B D F Ab
    })

    it('creates a half-diminished 7th chord', () => {
      const bMin7b5 = new Chord(new PitchClass(11), 'min7b5')
      expect(bMin7b5.pitchClasses.map(p => p.value)).toEqual([11, 2, 5, 9]) // B D F A
    })
  })

  describe('symbol', () => {
    it('formats major chord symbols', () => {
      expect(new Chord(new PitchClass(0), 'major').symbol()).toBe('C')
      expect(new Chord(new PitchClass(7), 'major').symbol()).toBe('G')
    })

    it('formats minor chord symbols', () => {
      expect(new Chord(new PitchClass(9), 'minor').symbol()).toBe('Am')
      expect(new Chord(new PitchClass(2), 'minor').symbol()).toBe('Dm')
    })

    it('formats 7th chord symbols', () => {
      expect(new Chord(new PitchClass(7), 'dom7').symbol()).toBe('G7')
      expect(new Chord(new PitchClass(0), 'maj7').symbol()).toBe('Cmaj7')
      expect(new Chord(new PitchClass(2), 'min7').symbol()).toBe('Dm7')
    })

    it('uses flat spelling for flat keys', () => {
      expect(new Chord(new PitchClass(1), 'major').symbol(true)).toBe('Db')
      expect(new Chord(new PitchClass(3), 'minor').symbol(true)).toBe('Ebm')
      expect(new Chord(new PitchClass(10), 'dom7').symbol(true)).toBe('Bb7')
    })

    it('formats diminished and augmented symbols', () => {
      expect(new Chord(new PitchClass(11), 'diminished').symbol()).toBe('Bdim')
      expect(new Chord(new PitchClass(0), 'augmented').symbol()).toBe('Caug')
      expect(new Chord(new PitchClass(11), 'dim7').symbol()).toBe('Bdim7')
      expect(new Chord(new PitchClass(11), 'min7b5').symbol()).toBe('Bm7b5')
    })
  })

  describe('equals', () => {
    it('considers chords with same root and quality as equal', () => {
      const a = new Chord(new PitchClass(0), 'major')
      const b = new Chord(new PitchClass(0), 'major')
      expect(a.equals(b)).toBe(true)
    })

    it('considers chords with different root or quality as not equal', () => {
      const cMaj = new Chord(new PitchClass(0), 'major')
      const cMin = new Chord(new PitchClass(0), 'minor')
      const dMaj = new Chord(new PitchClass(2), 'major')
      expect(cMaj.equals(cMin)).toBe(false)
      expect(cMaj.equals(dMaj)).toBe(false)
    })
  })

  describe('isTriad / isSeventh', () => {
    it('identifies triads', () => {
      expect(new Chord(new PitchClass(0), 'major').isTriad()).toBe(true)
      expect(new Chord(new PitchClass(0), 'minor').isTriad()).toBe(true)
      expect(new Chord(new PitchClass(0), 'diminished').isTriad()).toBe(true)
      expect(new Chord(new PitchClass(0), 'augmented').isTriad()).toBe(true)
    })

    it('identifies seventh chords', () => {
      expect(new Chord(new PitchClass(0), 'dom7').isSeventh()).toBe(true)
      expect(new Chord(new PitchClass(0), 'maj7').isSeventh()).toBe(true)
      expect(new Chord(new PitchClass(0), 'min7').isSeventh()).toBe(true)
      expect(new Chord(new PitchClass(0), 'dim7').isSeventh()).toBe(true)
      expect(new Chord(new PitchClass(0), 'min7b5').isSeventh()).toBe(true)
    })

    it('seventh chords are not triads', () => {
      expect(new Chord(new PitchClass(0), 'dom7').isTriad()).toBe(false)
    })
  })
})
