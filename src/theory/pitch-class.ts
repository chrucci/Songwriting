import { NOTE_NAMES_SHARP, NOTE_NAMES_FLAT } from './constants'

/**
 * Represents a pitch class (0-11) in twelve-tone equal temperament.
 * Immutable value object. C=0, C#/Db=1, D=2, ... B=11.
 */
export class PitchClass {
  readonly value: number

  constructor(value: number) {
    this.value = ((value % 12) + 12) % 12
  }

  /** Create a new PitchClass transposed by the given interval in semitones. */
  transpose(semitones: number): PitchClass {
    return new PitchClass(this.value + semitones)
  }

  /** Check equality by pitch class value. */
  equals(other: PitchClass): boolean {
    return this.value === other.value
  }

  /** Get the note name string, using sharps or flats. */
  name(preferFlats = false): string {
    return preferFlats
      ? NOTE_NAMES_FLAT[this.value]
      : NOTE_NAMES_SHARP[this.value]
  }

  /** Ascending semitone distance from this pitch class to the other. */
  semitoneDistance(other: PitchClass): number {
    return ((other.value - this.value) % 12 + 12) % 12
  }

  /** Parse a note name string into a PitchClass. */
  static fromName(name: string): PitchClass {
    let index = NOTE_NAMES_SHARP.indexOf(name as typeof NOTE_NAMES_SHARP[number])
    if (index === -1) {
      index = NOTE_NAMES_FLAT.indexOf(name as typeof NOTE_NAMES_FLAT[number])
    }
    if (index === -1) {
      throw new Error(`Invalid note name: "${name}"`)
    }
    return new PitchClass(index)
  }

  /** Find pitch classes common to both sets. */
  static sharedNotes(setA: PitchClass[], setB: PitchClass[]): PitchClass[] {
    return setA.filter(a => setB.some(b => a.equals(b)))
  }
}
