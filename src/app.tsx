import './styles/global.css'
import './styles/components.css'
import { KeySelector } from './components/key-selector'
import { ChordBrowser } from './components/chord-browser'
import { ProgressionTimeline } from './components/progression-timeline'
import { tonicChord, preferFlats } from './state/signals'

export function App() {
  const tonic = tonicChord.value

  return (
    <div class="app">
      <header class="app-header">
        <div class="app-header__left">
          <h1>Chord Explorer</h1>
          <p class="subtitle">Familiar But Different</p>
        </div>
        <div class="app-header__tonic">
          <span class="tonic-label">Tonic:</span>
          <span class="tonic-chord">{tonic.symbol(preferFlats.value)}</span>
          <span class="tonic-notes">
            ({tonic.pitchClasses.map(p => p.name(preferFlats.value)).join(' ')})
          </span>
        </div>
      </header>
      <div class="app-key-selector">
        <KeySelector />
      </div>
      <div class="app-layout">
        <ChordBrowser />
        <main class="app-main">
          <ProgressionTimeline />
        </main>
        <aside class="app-detail">
          <div class="placeholder">
            <p>Select a chord to see details, voicings, and harmonic tools.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
