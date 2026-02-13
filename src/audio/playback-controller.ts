import { SynthEngine, pitchClassToMidi } from './synth-engine'
import type { Chord } from '../theory/chord'

export type PlaybackStatus = 'stopped' | 'playing' | 'paused'

export interface PlaybackPosition {
  sectionIndex: number
  chordIndex: number
}

export type PositionCallback = (position: PlaybackPosition | null) => void

/**
 * Controller for sequential chord playback.
 * Observer pattern: calls back on position changes.
 */
export class PlaybackController {
  private synth = new SynthEngine()
  private timerId: ReturnType<typeof setTimeout> | null = null
  private status: PlaybackStatus = 'stopped'
  private listeners: PositionCallback[] = []

  /** Subscribe to playback position changes. */
  onPositionChange(cb: PositionCallback): () => void {
    this.listeners.push(cb)
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb)
    }
  }

  private notifyPosition(pos: PlaybackPosition | null): void {
    for (const cb of this.listeners) cb(pos)
  }

  /** Play a flat list of chords sequentially. */
  playChords(
    chords: { chord: Chord; sectionIndex: number; chordIndex: number }[],
    bpm: number,
    beatsPerChord = 4,
  ): void {
    this.stop()
    if (chords.length === 0) return

    this.status = 'playing'
    const durationMs = (beatsPerChord / bpm) * 60 * 1000
    const durationSec = durationMs / 1000

    let i = 0

    const playNext = () => {
      if (this.status !== 'playing' || i >= chords.length) {
        this.status = 'stopped'
        this.notifyPosition(null)
        return
      }

      const entry = chords[i]
      this.notifyPosition({
        sectionIndex: entry.sectionIndex,
        chordIndex: entry.chordIndex,
      })

      // Convert chord pitch classes to MIDI notes
      const midiNotes = chordToMidiNotes(entry.chord)
      this.synth.playChord(midiNotes, durationSec)

      i++
      this.timerId = setTimeout(playNext, durationMs)
    }

    playNext()
  }

  /** Stop playback. */
  stop(): void {
    this.status = 'stopped'
    if (this.timerId !== null) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
    this.synth.stopAll()
    this.notifyPosition(null)
  }

  /** Pause playback. */
  pause(): void {
    if (this.status === 'playing') {
      this.status = 'paused'
      if (this.timerId !== null) {
        clearTimeout(this.timerId)
        this.timerId = null
      }
      this.synth.stopAll()
    }
  }

  getStatus(): PlaybackStatus {
    return this.status
  }
}

/** Convert a Chord to MIDI note numbers, voiced in octave 3-4. */
function chordToMidiNotes(chord: Chord): number[] {
  return chord.pitchClasses.map((pc, i) => {
    // Root in octave 3, upper notes in octave 4 if they'd go below root
    const rootMidi = pitchClassToMidi(chord.root.value, 3)
    let midi = pitchClassToMidi(pc.value, 3)
    if (i > 0 && midi <= rootMidi) {
      midi += 12
    }
    return midi
  })
}
