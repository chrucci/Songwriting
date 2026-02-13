import { Chord } from '../chord'

/**
 * Computes the secondary dominant (V7) of a target chord.
 * The secondary dominant is a dom7 chord built on the 5th above the target's root.
 */
export class SecondaryDominantTool {
  compute(target: Chord): Chord {
    const dominantRoot = target.root.transpose(7) // perfect 5th above
    return new Chord(dominantRoot, 'dom7')
  }
}
