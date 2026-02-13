import { signal } from '@preact/signals'
import { currentProgression, tempo } from '../state/signals'
import { PlaybackController } from '../audio/playback-controller'
import type { PlaybackPosition } from '../audio/playback-controller'

const controller = new PlaybackController()
const playbackStatus = signal<'stopped' | 'playing' | 'paused'>('stopped')
const currentPosition = signal<PlaybackPosition | null>(null)

controller.onPositionChange((pos) => {
  currentPosition.value = pos
  if (!pos) {
    playbackStatus.value = 'stopped'
  }
})

export { currentPosition }

function handlePlay() {
  const prog = currentProgression.value
  const chords: { chord: typeof prog.sections[0]['chords'][0]['chord']; sectionIndex: number; chordIndex: number }[] = []

  prog.sections.forEach((section, si) => {
    section.chords.forEach((slot, ci) => {
      chords.push({ chord: slot.chord, sectionIndex: si, chordIndex: ci })
    })
  })

  if (chords.length === 0) return

  playbackStatus.value = 'playing'
  controller.playChords(chords, tempo.value)
}

function handleStop() {
  controller.stop()
  playbackStatus.value = 'stopped'
}

function handlePause() {
  controller.pause()
  playbackStatus.value = 'paused'
}

export function PlaybackControls() {
  const status = playbackStatus.value

  return (
    <div class="playback-controls">
      <h3 class="playback-controls__title">Playback</h3>
      <div class="playback-controls__buttons">
        {status !== 'playing' ? (
          <button class="btn btn--primary" onClick={handlePlay} title="Play">
            &#9654; Play
          </button>
        ) : (
          <button class="btn" onClick={handlePause} title="Pause">
            &#9646;&#9646; Pause
          </button>
        )}
        <button
          class="btn"
          onClick={handleStop}
          disabled={status === 'stopped'}
          title="Stop"
        >
          &#9632; Stop
        </button>
      </div>
      <div class="playback-controls__tempo">
        <label>
          BPM:
          <input
            type="range"
            min={40}
            max={200}
            value={tempo.value}
            onInput={(e) => {
              tempo.value = parseInt((e.target as HTMLInputElement).value, 10)
            }}
          />
          <span class="playback-controls__tempo-value">{tempo.value}</span>
        </label>
      </div>
    </div>
  )
}
