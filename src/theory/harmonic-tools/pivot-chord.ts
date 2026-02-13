import { Chord } from '../chord'
import { ChordFactory } from '../chord-factory'

/**
 * Finds pivot chords — chords that are diatonic to both the current key
 * and a target key. Useful for modulation.
 */
export class PivotChordTool {
  compute(
    currentKeyRoot: number,
    currentMode: 'major' | 'minor',
    targetKeyRoot: number,
    targetMode: 'major' | 'minor',
  ): Chord[] {
    const currentDiatonic = ChordFactory.diatonicTriads(currentKeyRoot, currentMode)
    const targetDiatonic = ChordFactory.diatonicTriads(targetKeyRoot, targetMode)

    return currentDiatonic.filter(c1 =>
      targetDiatonic.some(c2 => c1.equals(c2)),
    )
  }
}
