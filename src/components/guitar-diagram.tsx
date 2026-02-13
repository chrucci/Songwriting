import { useRef, useEffect } from 'preact/hooks'
import { signal } from '@preact/signals'
import { SVGuitarChord } from 'svguitar'
import { selectedChordSlotId, currentProgression, preferFlats } from '../state/signals'
import { GuitarChordDB } from '../data/guitar-chord-db'
import type { GuitarVoicing } from '../data/guitar-chord-db'
import type { Chord } from '../theory/chord'

const chordDb = new GuitarChordDB()
const voicingIndex = signal(0)

function findSelectedChord(): Chord | null {
  const slotId = selectedChordSlotId.value
  if (!slotId) return null
  for (const section of currentProgression.value.sections) {
    const slot = section.chords.find(c => c.id === slotId)
    if (slot) return slot.chord
  }
  return null
}

interface DiagramRendererProps {
  voicing: GuitarVoicing
  title: string
}

function DiagramRenderer({ voicing, title }: DiagramRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.innerHTML = ''

    const chart = new SVGuitarChord(el)
    chart.configure({
      strings: 6,
      frets: 4,
      position: voicing.position,
      title,
      color: '#e0e0e0',
      backgroundColor: 'transparent',
      fingerColor: '#bb86fc',
      fingerTextColor: '#1a1a2e',
      stringColor: '#555',
      fretColor: '#555',
      titleColor: '#e0e0e0',
      nutWidth: 5,
      fretLabelColor: '#999',
      tuningsColor: '#999',
      tuning: ['E', 'A', 'D', 'G', 'B', 'e'],
      fontFamily: 'inherit',
      fingerSize: 0.65,
      fingerTextSize: 12,
      strokeWidth: 2,
    })

    chart.chord({
      fingers: voicing.fingers.map(f => [f[0], f[1], f[2]] as [number, number | 0 | 'x', string?]),
      barres: voicing.barres.map(b => ({
        fromString: b.fromString,
        toString: b.toString,
        fret: b.fret,
      })),
    })

    chart.draw()

    return () => {
      chart.remove()
    }
  }, [voicing, title])

  return <div ref={containerRef} class="guitar-diagram__svg" />
}

export function GuitarDiagram() {
  const chord = findSelectedChord()
  const flats = preferFlats.value

  if (!chord) {
    return (
      <div class="guitar-diagram">
        <h3 class="guitar-diagram__title">Guitar Voicing</h3>
        <p class="guitar-diagram__hint">Select a chord in the progression to see guitar voicings.</p>
      </div>
    )
  }

  const voicings = chordDb.getVoicings(chord.root.value, chord.quality)

  if (voicings.length === 0) {
    return (
      <div class="guitar-diagram">
        <h3 class="guitar-diagram__title">Guitar Voicing</h3>
        <p class="guitar-diagram__hint">No voicing available for {chord.symbol(flats)}.</p>
      </div>
    )
  }

  const idx = voicingIndex.value % voicings.length
  const currentVoicing = voicings[idx]
  const title = chord.symbol(flats)

  return (
    <div class="guitar-diagram">
      <h3 class="guitar-diagram__title">Guitar Voicing</h3>
      <DiagramRenderer voicing={currentVoicing} title={title} />
      {voicings.length > 1 && (
        <div class="guitar-diagram__nav">
          <button
            class="btn btn--small"
            onClick={() => { voicingIndex.value = (idx - 1 + voicings.length) % voicings.length }}
          >
            Prev
          </button>
          <span class="guitar-diagram__nav-label">
            {currentVoicing.label} ({idx + 1}/{voicings.length})
          </span>
          <button
            class="btn btn--small"
            onClick={() => { voicingIndex.value = (idx + 1) % voicings.length }}
          >
            Next
          </button>
        </div>
      )}
      {voicings.length === 1 && (
        <div class="guitar-diagram__nav">
          <span class="guitar-diagram__nav-label">{currentVoicing.label}</span>
        </div>
      )}
    </div>
  )
}
