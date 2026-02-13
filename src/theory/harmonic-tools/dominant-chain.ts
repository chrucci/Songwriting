import { Chord } from '../chord'
import { SecondaryDominantTool } from './secondary-dominant'

/**
 * Builds a chain of secondary dominants resolving to a target chord.
 * Each dom7 resolves down a 4th (= up a 5th) to the next.
 * E.g., chain of length 3 to C: E7 → A7 → D7 → G7 → C
 */
export class DominantChainTool {
  private secDom = new SecondaryDominantTool()

  /** Build a dominant chain of the given length leading to the target. */
  compute(target: Chord, chainLength: number): Chord[] {
    const chain: Chord[] = [target]
    let current = target
    for (let i = 0; i < chainLength; i++) {
      current = this.secDom.compute(current)
      chain.unshift(current)
    }
    return chain
  }
}
