import { describe, it, expect } from 'vitest'
import { PitchClass } from '../pitch-class'

describe('PitchClass', () => {
  describe('constructor and value', () => {
    it('stores a valid pitch class value 0-11', () => {
      const c = new PitchClass(0)
      expect(c.value).toBe(0)

      const b = new PitchClass(11)
      expect(b.value).toBe(11)
    })

    it('normalizes values outside 0-11 range via mod 12', () => {
      const wrapped = new PitchClass(12)
      expect(wrapped.value).toBe(0)

      const negative = new PitchClass(-1)
      expect(negative.value).toBe(11)

      const large = new PitchClass(25)
      expect(large.value).toBe(1)
    })
  })

  describe('transpose', () => {
    it('transposes up within range', () => {
      const c = new PitchClass(0) // C
      expect(c.transpose(4).value).toBe(4) // E
    })

    it('wraps around when transposing past B', () => {
      const b = new PitchClass(11) // B
      expect(b.transpose(1).value).toBe(0) // C
      expect(b.transpose(3).value).toBe(2) // D
    })

    it('transposes down with negative intervals', () => {
      const c = new PitchClass(0) // C
      expect(c.transpose(-1).value).toBe(11) // B
    })

    it('returns a new PitchClass (immutable)', () => {
      const c = new PitchClass(0)
      const e = c.transpose(4)
      expect(c.value).toBe(0) // original unchanged
      expect(e.value).toBe(4)
      expect(c).not.toBe(e)
    })
  })

  describe('equals', () => {
    it('returns true for same pitch class value', () => {
      expect(new PitchClass(0).equals(new PitchClass(0))).toBe(true)
      expect(new PitchClass(7).equals(new PitchClass(7))).toBe(true)
    })

    it('returns false for different values', () => {
      expect(new PitchClass(0).equals(new PitchClass(1))).toBe(false)
    })

    it('considers enharmonic equivalents as equal', () => {
      // PitchClass(1) is both C# and Db — same value
      expect(new PitchClass(1).equals(new PitchClass(1))).toBe(true)
    })
  })

  describe('name', () => {
    it('returns sharp spelling by default', () => {
      expect(new PitchClass(0).name()).toBe('C')
      expect(new PitchClass(1).name()).toBe('C#')
      expect(new PitchClass(4).name()).toBe('E')
      expect(new PitchClass(6).name()).toBe('F#')
    })

    it('returns flat spelling when preferFlats is true', () => {
      expect(new PitchClass(1).name(true)).toBe('Db')
      expect(new PitchClass(3).name(true)).toBe('Eb')
      expect(new PitchClass(6).name(true)).toBe('Gb')
      expect(new PitchClass(8).name(true)).toBe('Ab')
      expect(new PitchClass(10).name(true)).toBe('Bb')
    })

    it('returns same name for natural notes regardless of spelling', () => {
      expect(new PitchClass(0).name(true)).toBe('C')
      expect(new PitchClass(4).name(true)).toBe('E')
      expect(new PitchClass(5).name(true)).toBe('F')
    })
  })

  describe('semitoneDistance', () => {
    it('computes ascending distance between pitch classes', () => {
      const c = new PitchClass(0)
      const g = new PitchClass(7)
      expect(c.semitoneDistance(g)).toBe(7)
    })

    it('computes distance wrapping around', () => {
      const g = new PitchClass(7)
      const c = new PitchClass(0)
      expect(g.semitoneDistance(c)).toBe(5) // G up to C = 5 semitones
    })
  })

  describe('static fromName', () => {
    it('parses sharp note names', () => {
      expect(PitchClass.fromName('C').value).toBe(0)
      expect(PitchClass.fromName('C#').value).toBe(1)
      expect(PitchClass.fromName('F#').value).toBe(6)
      expect(PitchClass.fromName('B').value).toBe(11)
    })

    it('parses flat note names', () => {
      expect(PitchClass.fromName('Db').value).toBe(1)
      expect(PitchClass.fromName('Eb').value).toBe(3)
      expect(PitchClass.fromName('Gb').value).toBe(6)
      expect(PitchClass.fromName('Ab').value).toBe(8)
      expect(PitchClass.fromName('Bb').value).toBe(10)
    })

    it('throws on invalid note names', () => {
      expect(() => PitchClass.fromName('X')).toThrow()
      expect(() => PitchClass.fromName('')).toThrow()
    })
  })

  describe('static sharedNotes', () => {
    it('finds common pitch classes between two sets', () => {
      const cMajor = [new PitchClass(0), new PitchClass(4), new PitchClass(7)] // C E G
      const aMinor = [new PitchClass(9), new PitchClass(0), new PitchClass(4)] // A C E
      const shared = PitchClass.sharedNotes(cMajor, aMinor)
      expect(shared.map(p => p.value).sort()).toEqual([0, 4]) // C and E
    })

    it('returns empty array when no shared notes', () => {
      const cMajor = [new PitchClass(0), new PitchClass(4), new PitchClass(7)]
      const fSharpMin = [new PitchClass(6), new PitchClass(9), new PitchClass(1)]
      const shared = PitchClass.sharedNotes(cMajor, fSharpMin)
      expect(shared).toEqual([])
    })

    it('returns one shared note', () => {
      const cMajor = [new PitchClass(0), new PitchClass(4), new PitchClass(7)]
      const fMajor = [new PitchClass(5), new PitchClass(9), new PitchClass(0)] // F A C
      const shared = PitchClass.sharedNotes(cMajor, fMajor)
      expect(shared.map(p => p.value)).toEqual([0]) // C
    })
  })
})
