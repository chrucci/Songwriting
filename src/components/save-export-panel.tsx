import { signal } from '@preact/signals'
import { currentProgression, tempo, resetProgression } from '../state/signals'
import { ProgressionRepository } from '../state/progression-repository'
import { MidiExporter } from '../audio/midi-exporter'

const repo = new ProgressionRepository()
const midiExporter = new MidiExporter()
const savedList = signal<{ id: string; name: string }[]>(
  repo.loadAll().map(p => ({ id: p.id, name: p.name })),
)
const statusMessage = signal('')

function refreshSavedList() {
  savedList.value = repo.loadAll().map(p => ({ id: p.id, name: p.name }))
}

function handleSave() {
  const prog = currentProgression.value
  repo.save(prog)
  refreshSavedList()
  statusMessage.value = `Saved "${prog.name}"`
  setTimeout(() => { statusMessage.value = '' }, 2000)
}

function handleLoad(id: string) {
  const all = repo.loadAll()
  const found = all.find(p => p.id === id)
  if (found) {
    // Reconstruct Chord objects from stored data
    // Note: localStorage stores plain objects; for full fidelity
    // we'd need serialization/deserialization. For MVP, we store
    // the signal value directly (which works within a session).
    currentProgression.value = found
    statusMessage.value = `Loaded "${found.name}"`
    setTimeout(() => { statusMessage.value = '' }, 2000)
  }
}

function handleDelete(id: string) {
  repo.delete(id)
  refreshSavedList()
  statusMessage.value = 'Deleted'
  setTimeout(() => { statusMessage.value = '' }, 2000)
}

function handleExportMidi() {
  midiExporter.export(currentProgression.value, tempo.value)
  statusMessage.value = 'MIDI exported'
  setTimeout(() => { statusMessage.value = '' }, 2000)
}

export function SaveExportPanel() {
  const prog = currentProgression.value
  const saved = savedList.value

  return (
    <div class="save-export">
      <h3 class="save-export__title">Save & Export</h3>

      <div class="save-export__field">
        <label>
          Name:
          <input
            type="text"
            value={prog.name}
            onInput={(e) => {
              currentProgression.value = {
                ...prog,
                name: (e.target as HTMLInputElement).value,
              }
            }}
            class="save-export__input"
          />
        </label>
      </div>

      <div class="save-export__buttons">
        <button class="btn btn--primary btn--small" onClick={handleSave}>
          Save
        </button>
        <button class="btn btn--small" onClick={handleExportMidi}>
          Export MIDI
        </button>
        <button class="btn btn--small" onClick={resetProgression}>
          New
        </button>
      </div>

      {statusMessage.value && (
        <div class="save-export__status">{statusMessage.value}</div>
      )}

      {saved.length > 0 && (
        <div class="save-export__saved">
          <h4>Saved Progressions</h4>
          {saved.map(s => (
            <div key={s.id} class="save-export__item">
              <span class="save-export__item-name">{s.name}</span>
              <button class="btn btn--small" onClick={() => handleLoad(s.id)}>
                Load
              </button>
              <button
                class="btn btn--small"
                onClick={() => handleDelete(s.id)}
                style={{ color: 'var(--color-far)' }}
              >
                Del
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
