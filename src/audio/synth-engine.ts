/**
 * Web Audio API synth engine for playing chords.
 * Uses oscillators with ADSR-style gain envelopes for piano-like tones.
 */
export class SynthEngine {
  private ctx: AudioContext | null = null
  private activeNodes: OscillatorNode[] = []

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  /**
   * Play a chord as simultaneous tones.
   * @param midiNotes Array of MIDI note numbers (e.g., 60 = middle C)
   * @param duration Duration in seconds
   * @param waveform Oscillator waveform type
   */
  playChord(
    midiNotes: number[],
    duration: number,
    waveform: OscillatorType = 'triangle',
  ): void {
    const ctx = this.getContext()
    const now = ctx.currentTime

    // Attack, decay, sustain, release parameters
    const attack = 0.02
    const decay = 0.1
    const sustainLevel = 0.3
    const release = 0.15

    for (const midi of midiNotes) {
      const freq = midiToFreq(midi)

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = waveform
      osc.frequency.setValueAtTime(freq, now)

      // ADSR envelope
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.4, now + attack)
      gain.gain.linearRampToValueAtTime(sustainLevel, now + attack + decay)
      gain.gain.setValueAtTime(sustainLevel, now + duration - release)
      gain.gain.linearRampToValueAtTime(0, now + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + duration + 0.01)

      this.activeNodes.push(osc)

      osc.onended = () => {
        const idx = this.activeNodes.indexOf(osc)
        if (idx !== -1) this.activeNodes.splice(idx, 1)
        osc.disconnect()
        gain.disconnect()
      }
    }
  }

  /** Stop all currently playing sounds. */
  stopAll(): void {
    for (const osc of this.activeNodes) {
      try {
        osc.stop()
      } catch {
        // already stopped
      }
    }
    this.activeNodes = []
  }

  /** Get the current audio context time. */
  get currentTime(): number {
    return this.ctx?.currentTime ?? 0
  }
}

/** Convert a MIDI note number to frequency in Hz. */
function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

/** Convert a pitch class (0-11) to a MIDI note in octave 4. */
export function pitchClassToMidi(pc: number, octave = 4): number {
  return (octave + 1) * 12 + pc
}
