import type { Chord } from './chord'
import { SecondaryDominantTool } from './harmonic-tools/secondary-dominant'
import { DominantChainTool } from './harmonic-tools/dominant-chain'
import { TritoneSubstitutionTool } from './harmonic-tools/tritone-substitution'
import { DiminishedBridgeTool } from './harmonic-tools/diminished-bridge'
import { AugmentedConnectionsTool } from './harmonic-tools/augmented-connections'
import { PivotChordTool } from './harmonic-tools/pivot-chord'

/**
 * Facade over all harmonic tools.
 * Provides a unified API for one-click harmonic operations.
 */
export class HarmonicToolkit {
  private secDom = new SecondaryDominantTool()
  private domChain = new DominantChainTool()
  private tritoneSub = new TritoneSubstitutionTool()
  private dimBridge = new DiminishedBridgeTool()
  private augConnect = new AugmentedConnectionsTool()
  private pivot = new PivotChordTool()

  /** Get the secondary dominant (V7) of a target chord. */
  secondaryDominant(target: Chord): Chord {
    return this.secDom.compute(target)
  }

  /** Build a chain of secondary dominants leading to the target. */
  dominantChain(target: Chord, length: number): Chord[] {
    return this.domChain.compute(target, length)
  }

  /** Get the tritone substitution of a dominant 7th chord. */
  tritoneSubstitution(chord: Chord): Chord {
    return this.tritoneSub.compute(chord)
  }

  /** Find diminished 7th chords bridging between two chords. */
  diminishedBridge(source: Chord, target: Chord): Chord[] {
    return this.dimBridge.compute(source, target)
  }

  /** Find augmented triads connecting two chords. */
  augmentedConnections(source: Chord, target: Chord): Chord[] {
    return this.augConnect.compute(source, target)
  }

  /** Find triads reachable from an augmented triad by ±1 semitone. */
  augmentedReachableTriads(aug: Chord): Chord[] {
    return this.augConnect.reachableTriads(aug)
  }

  /** Find pivot chords diatonic to both keys. */
  pivotChords(
    currentKeyRoot: number,
    currentMode: 'major' | 'minor',
    targetKeyRoot: number,
    targetMode: 'major' | 'minor',
  ): Chord[] {
    return this.pivot.compute(currentKeyRoot, currentMode, targetKeyRoot, targetMode)
  }
}
