import { PitchClass } from './pitch-class'
import {
  MAJOR_SCALE_INTERVALS,
  MINOR_SCALE_INTERVALS,
  FLAT_KEY_ROOTS,
} from './constants'

/**
 * Represents a musical scale: a root and its 7 scale degrees.
 */
export class Scale {
  readonly root: PitchClass
  readonly mode: 'major' | 'minor'
  readonly degrees: readonly PitchClass[]
  readonly preferFlats: boolean

  private constructor(root: PitchClass, mode: 'major' | 'minor', degrees: PitchClass[]) {
    this.root = root
    this.mode = mode
    this.degrees = degrees
    this.preferFlats = FLAT_KEY_ROOTS.has(root.value)
  }

  /** Create a major scale from a root pitch class value. */
  static major(rootValue: number): Scale {
    const root = new PitchClass(rootValue)
    const degrees = MAJOR_SCALE_INTERVALS.map(i => root.transpose(i))
    return new Scale(root, 'major', degrees)
  }

  /** Create a natural minor scale from a root pitch class value. */
  static minor(rootValue: number): Scale {
    const root = new PitchClass(rootValue)
    const degrees = MINOR_SCALE_INTERVALS.map(i => root.transpose(i))
    return new Scale(root, 'minor', degrees)
  }

  /** Check if a pitch class belongs to this scale. */
  contains(pc: PitchClass): boolean {
    return this.degrees.some(d => d.equals(pc))
  }

  /** Get the 1-indexed scale degree of a pitch class, or -1 if not in scale. */
  degreeOf(pc: PitchClass): number {
    const index = this.degrees.findIndex(d => d.equals(pc))
    return index === -1 ? -1 : index + 1
  }
}
