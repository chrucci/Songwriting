import { Chord } from '../chord'

/**
 * Computes the tritone substitution of a dominant 7th chord.
 * Swaps a dom7 with the dom7 a tritone (6 semitones) away.
 * Both share the same tritone interval (3rd and 7th swap roles).
 */
export class TritoneSubstitutionTool {
  compute(chord: Chord): Chord {
    const subRoot = chord.root.transpose(6)
    return new Chord(subRoot, 'dom7')
  }
}
