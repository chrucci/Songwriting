import type { Chord } from './chord'

/** Classical harmonic function categories. */
export type HarmonicFunction = 'T' | 'S' | 'D'

/** Result of function analysis for a single chord. */
export interface FunctionLabel {
  /** The harmonic function category. */
  func: HarmonicFunction
  /** Human-readable explanation. */
  explanation: string
  /** Roman numeral label (e.g., "I", "IV", "V7", "ii"). */
  romanNumeral: string
}

/**
 * Abstract base class for harmonic function analysis.
 * Open/Closed Principle: new analysis systems extend this class
 * without modifying existing ones.
 */
export abstract class FunctionAnalyzer {
  abstract analyze(
    chord: Chord,
    keyRoot: number,
    mode: 'major' | 'minor',
  ): FunctionLabel
}
