import { describe, it, expect } from 'vitest'
import { HarmonicToolkit } from '../harmonic-toolkit'
import { Chord } from '../chord'
import { PitchClass } from '../pitch-class'

function chord(root: number, quality: 'major' | 'minor' | 'dom7' = 'major'): Chord {
  return new Chord(new PitchClass(root), quality)
}

describe('HarmonicToolkit', () => {
  const toolkit = new HarmonicToolkit()

  describe('secondaryDominant', () => {
    it('V/ii: secondary dominant of Dm is A7', () => {
      const dm = chord(2, 'minor')
      const result = toolkit.secondaryDominant(dm)
      expect(result.root.value).toBe(9) // A
      expect(result.quality).toBe('dom7')
      expect(result.symbol()).toBe('A7')
    })

    it('V/V: secondary dominant of G is D7', () => {
      const g = chord(7)
      const result = toolkit.secondaryDominant(g)
      expect(result.root.value).toBe(2) // D
      expect(result.symbol()).toBe('D7')
    })

    it('V/vi: secondary dominant of Am is E7', () => {
      const am = chord(9, 'minor')
      const result = toolkit.secondaryDominant(am)
      expect(result.root.value).toBe(4) // E
      expect(result.symbol()).toBe('E7')
    })
  })

  describe('dominantChain', () => {
    it('builds chain of length 1 to G: D7 -> G', () => {
      const g = chord(7)
      const chain = toolkit.dominantChain(g, 1)
      expect(chain).toHaveLength(2)
      expect(chain[0].symbol()).toBe('D7')
      expect(chain[1].symbol()).toBe('G')
    })

    it('builds chain of length 3 to C: A7 -> D7 -> G7 -> C', () => {
      const c = chord(0)
      const chain = toolkit.dominantChain(c, 3)
      expect(chain).toHaveLength(4)
      expect(chain.map(c => c.symbol())).toEqual(['A7', 'D7', 'G7', 'C'])
    })

    it('chain of length 0 returns just the target', () => {
      const c = chord(0)
      const chain = toolkit.dominantChain(c, 0)
      expect(chain).toHaveLength(1)
      expect(chain[0].symbol()).toBe('C')
    })
  })

  describe('tritoneSubstitution', () => {
    it('tritone sub of G7 is Db7', () => {
      const g7 = chord(7, 'dom7')
      const result = toolkit.tritoneSubstitution(g7)
      expect(result.root.value).toBe(1) // Db/C#
      expect(result.quality).toBe('dom7')
    })

    it('tritone sub of Db7 is G7 (symmetric)', () => {
      const db7 = new Chord(new PitchClass(1), 'dom7')
      const result = toolkit.tritoneSubstitution(db7)
      expect(result.root.value).toBe(7) // G
    })

    it('tritone sub shares the same tritone interval', () => {
      const g7 = chord(7, 'dom7')
      const sub = toolkit.tritoneSubstitution(g7)
      // G7 contains B(11) and F(5) — the tritone
      // Db7 contains F(5) and B/Cb(11) — same tritone
      const g7Notes = new Set(g7.pitchClasses.map(p => p.value))
      const subNotes = new Set(sub.pitchClasses.map(p => p.value))
      // Both should contain 5 and 11
      expect(g7Notes.has(5)).toBe(true)
      expect(g7Notes.has(11)).toBe(true)
      expect(subNotes.has(5)).toBe(true)
      expect(subNotes.has(11)).toBe(true)
    })
  })

  describe('diminishedBridge', () => {
    it('finds dim7 bridges between C and Eb', () => {
      const c = chord(0)
      const eb = chord(3)
      const bridges = toolkit.diminishedBridge(c, eb)
      expect(bridges.length).toBeGreaterThan(0)
      bridges.forEach(b => expect(b.quality).toBe('dim7'))
    })

    it('returns at most 3 distinct dim7 chords', () => {
      const c = chord(0)
      const fSharp = chord(6)
      const bridges = toolkit.diminishedBridge(c, fSharp)
      expect(bridges.length).toBeLessThanOrEqual(3)
    })
  })

  describe('augmentedConnections', () => {
    it('finds augmented triads connecting C and E', () => {
      const c = chord(0)
      const e = chord(4)
      const augs = toolkit.augmentedConnections(c, e)
      expect(augs.length).toBeGreaterThan(0)
      augs.forEach(a => expect(a.quality).toBe('augmented'))
    })

    it('returns at most 4 distinct augmented triads', () => {
      const c = chord(0)
      const g = chord(7)
      const augs = toolkit.augmentedConnections(c, g)
      expect(augs.length).toBeLessThanOrEqual(4)
    })
  })

  describe('augmentedReachableTriads', () => {
    it('finds 6 triads reachable from C augmented', () => {
      const caug = new Chord(new PitchClass(0), 'augmented') // C E G#
      const reachable = toolkit.augmentedReachableTriads(caug)
      // Each of 3 notes can move ±1 semitone = 6 possible triads
      expect(reachable.length).toBe(6)
    })
  })

  describe('pivotChords', () => {
    it('finds common chords between C major and G major', () => {
      const pivots = toolkit.pivotChords(0, 'major', 7, 'major')
      expect(pivots.length).toBeGreaterThan(0)
      // Em should be common (iii in C, vi in G)
      const hasEm = pivots.some(c => c.root.value === 4 && c.quality === 'minor')
      expect(hasEm).toBe(true)
    })

    it('finds common chords between C major and A minor (relative minor)', () => {
      const pivots = toolkit.pivotChords(0, 'major', 9, 'minor')
      // C major and A natural minor share the same notes, so many common chords
      expect(pivots.length).toBeGreaterThanOrEqual(3)
    })

    it('finds fewer common chords between distant keys', () => {
      const closeKey = toolkit.pivotChords(0, 'major', 7, 'major') // C to G
      const farKey = toolkit.pivotChords(0, 'major', 6, 'major')  // C to F#
      expect(closeKey.length).toBeGreaterThanOrEqual(farKey.length)
    })
  })
})
