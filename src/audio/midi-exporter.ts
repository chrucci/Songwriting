import MidiWriter from 'midi-writer-js'
import type { Progression } from '../state/signals'
import { pitchClassToMidi } from './synth-engine'

/**
 * Exports a Progression to a MIDI file.
 * Builder pattern: accumulates tracks and events before generating the file.
 */
export class MidiExporter {
  /** Export a progression as a downloadable .mid file. */
  export(progression: Progression, bpm: number): void {
    const track = new MidiWriter.Track()
    track.setTempo(bpm)

    for (const section of progression.sections) {
      for (const slot of section.chords) {
        const midiNotes = slot.chord.pitchClasses.map((pc) => {
          const rootMidi = pitchClassToMidi(slot.chord.root.value, 3)
          let midi = pitchClassToMidi(pc.value, 3)
          if (midi < rootMidi) midi += 12
          return midi
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        track.addEvent(
          new MidiWriter.NoteEvent({
            pitch: midiNotes as any,
            duration: `${slot.durationBeats}` as any,
            velocity: 80,
          }),
        )
      }
    }

    const writer = new MidiWriter.Writer([track])
    const fileData = writer.buildFile()
    const blob = new Blob([fileData as unknown as BlobPart], { type: 'audio/midi' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${progression.name || 'progression'}.mid`
    a.click()
    URL.revokeObjectURL(url)
  }
}
