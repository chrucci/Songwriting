import { FunctionAnalyzer } from './function-analyzer'
import type { FunctionLabel, HarmonicFunction } from './function-analyzer'
import { Chord } from './chord'
import { PitchClass } from './pitch-class'
import { Scale } from './scales'

/** Roman numeral labels for major scale degrees (0-indexed). */
const MAJOR_ROMAN: Record<string, string[]> = {
  major:      ['I',   '',    '',    'IV',  'V',   '',    ''],
  minor:      ['',    'ii',  'iii', '',    '',    'vi',  ''],
  diminished: ['',    '',    '',    '',    '',    '',    'vii\u00B0'],
}

/** Roman numeral labels for minor scale degrees (0-indexed). */
const MINOR_ROMAN: Record<string, string[]> = {
  major:      ['',    '',    'III', '',    'V',   'VI',  'VII'],
  minor:      ['i',   '',    '',    'iv',  'v',   '',    ''],
  diminished: ['',    'ii\u00B0', '', '',  '',    '',    ''],
}

/** Harmonic function assignment for major key diatonic chords. */
const MAJOR_FUNCTIONS: HarmonicFunction[] = ['T', 'S', 'T', 'S', 'D', 'T', 'D']

/** Harmonic function assignment for minor key diatonic chords. */
const MINOR_FUNCTIONS: HarmonicFunction[] = ['T', 'S', 'T', 'S', 'D', 'S', 'D']

/**
 * Classical/Riemannian function analysis.
 * Assigns T (Tonic), S (Subdominant), or D (Dominant) based on
 * shared pitch classes with the I, IV, and V chords.
 */
export class ClassicalFunctionAnalyzer extends FunctionAnalyzer {
  analyze(chord: Chord, keyRoot: number, mode: 'major' | 'minor'): FunctionLabel {
    const scale = mode === 'major' ? Scale.major(keyRoot) : Scale.minor(keyRoot)
    const degree = scale.degreeOf(chord.root)

    // If the chord root is diatonic, use the pre-mapped function
    if (degree !== -1) {
      const idx = degree - 1
      const func = (mode === 'major' ? MAJOR_FUNCTIONS : MINOR_FUNCTIONS)[idx]
      const romanNumeral = this.getRomanNumeral(idx, chord, mode, scale)
      return {
        func,
        romanNumeral,
        explanation: this.explain(func, romanNumeral),
      }
    }

    // Chromatic chord: fall back to shared-note analysis with I, IV, V
    return this.analyzeBySharedNotes(chord, keyRoot, mode)
  }

  private getRomanNumeral(
    degreeIndex: number,
    chord: Chord,
    mode: 'major' | 'minor',
    _scale: Scale,
  ): string {
    const table = mode === 'major' ? MAJOR_ROMAN : MINOR_ROMAN
    const qualityKey = chord.quality === 'dom7' ? 'major' : chord.quality
    const row = table[qualityKey]
    if (row && row[degreeIndex]) {
      return row[degreeIndex]
    }
    // Fallback: compute from interval
    return this.computeRomanNumeral(degreeIndex, chord, mode)
  }

  private computeRomanNumeral(
    degreeIndex: number,
    chord: Chord,
    mode: 'major' | 'minor',
  ): string {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    const base = numerals[degreeIndex]
    const isMinorQuality = chord.quality === 'minor' || chord.quality === 'min7'
    const isDim = chord.quality === 'diminished' || chord.quality === 'dim7'

    let result = isMinorQuality || isDim ? base.toLowerCase() : base
    if (isDim) result += '\u00B0'
    if (chord.quality === 'dom7') result += '7'
    if (chord.quality === 'maj7') result += 'maj7'
    if (chord.quality === 'min7') result += '7'
    if (chord.quality === 'dim7') result += '7'
    if (chord.quality === 'min7b5') result += '7'
    if (mode === 'minor' && !isMinorQuality && !isDim && degreeIndex > 0) {
      // In minor, uppercase numerals for major quality chords on non-tonic degrees
    }
    return result
  }

  private analyzeBySharedNotes(
    chord: Chord,
    keyRoot: number,
    mode: 'major' | 'minor',
  ): FunctionLabel {
    const I = new Chord(new PitchClass(keyRoot), mode === 'major' ? 'major' : 'minor')
    const IV = new Chord(
      new PitchClass(keyRoot).transpose(5),
      mode === 'major' ? 'major' : 'minor',
    )
    const V = new Chord(new PitchClass(keyRoot).transpose(7), 'major')

    const sharedWithI = PitchClass.sharedNotes([...I.pitchClasses], [...chord.pitchClasses]).length
    const sharedWithIV = PitchClass.sharedNotes([...IV.pitchClasses], [...chord.pitchClasses]).length
    const sharedWithV = PitchClass.sharedNotes([...V.pitchClasses], [...chord.pitchClasses]).length

    let func: HarmonicFunction
    if (sharedWithI >= sharedWithIV && sharedWithI >= sharedWithV) {
      func = 'T'
    } else if (sharedWithV >= sharedWithIV) {
      func = 'D'
    } else {
      func = 'S'
    }

    // Compute roman numeral for chromatic chord
    const interval = new PitchClass(keyRoot).semitoneDistance(chord.root)
    const accidental = this.chromaticAccidental(interval, mode)
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    const approxDegree = this.intervalToDegree(interval)
    let roman = numerals[approxDegree]
    const isMinorQ = chord.quality === 'minor' || chord.quality === 'min7'
    if (isMinorQ) roman = roman.toLowerCase()
    roman = accidental + roman

    return {
      func,
      romanNumeral: roman,
      explanation: this.explain(func, roman),
    }
  }

  private intervalToDegree(semitones: number): number {
    // Map semitone interval to approximate scale degree index
    const map: Record<number, number> = {
      0: 0, 1: 0, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
      7: 4, 8: 5, 9: 5, 10: 6, 11: 6,
    }
    return map[semitones] ?? 0
  }

  private chromaticAccidental(semitones: number, mode: 'major' | 'minor'): string {
    const diatonic = mode === 'major'
      ? new Set([0, 2, 4, 5, 7, 9, 11])
      : new Set([0, 2, 3, 5, 7, 8, 10])
    return diatonic.has(semitones) ? '' : '\u266D' // flat symbol for chromatic
  }

  private explain(func: HarmonicFunction, roman: string): string {
    const names: Record<HarmonicFunction, string> = {
      T: 'Tonic',
      S: 'Subdominant',
      D: 'Dominant',
    }
    return `${roman} — ${names[func]} function`
  }
}
