import type { Chord } from './chord'

/** Syntactical/contextual function roles based on position in a section. */
export type SyntacticalRole = 'T-opening' | 'S-transitional' | 'D-penultimate' | 'T-closing'

/** Result of syntactical function analysis for a single chord. */
export interface SyntacticalLabel {
  role: SyntacticalRole
  /** Position in the T→S→D→T circuit (1-4). */
  circuitPosition: number
  explanation: string
}

/**
 * Nobile's syntactical function analysis.
 * Assigns function by position within a formal section,
 * not by chord identity. The T→S→D→T circuit spans each section.
 */
export class SyntacticalFunctionAnalyzer {
  /**
   * Analyze an entire section of chords.
   * Returns a SyntacticalLabel for each chord position.
   */
  analyzeSection(
    chords: Chord[],
    _keyRoot: number,
    _mode: 'major' | 'minor',
  ): SyntacticalLabel[] {
    const len = chords.length

    if (len === 0) return []

    if (len === 1) {
      return [this.makeLabel('T-opening', 1)]
    }

    return chords.map((_chord, index) => {
      if (index === 0) {
        return this.makeLabel('T-opening', 1)
      }
      if (index === len - 1) {
        return this.makeLabel('T-closing', 4)
      }
      if (index === len - 2) {
        return this.makeLabel('D-penultimate', 3)
      }
      return this.makeLabel('S-transitional', 2)
    })
  }

  private makeLabel(role: SyntacticalRole, circuitPosition: number): SyntacticalLabel {
    const explanations: Record<SyntacticalRole, string> = {
      'T-opening': 'Opening position \u2014 tonic function (establishes home)',
      'S-transitional': 'Mid-section \u2014 subdominant/departure function',
      'D-penultimate': 'Penultimate position \u2014 dominant function (drives toward resolution)',
      'T-closing': 'Closing position \u2014 tonic resolution (return home)',
    }
    return { role, circuitPosition, explanation: explanations[role] }
  }
}
