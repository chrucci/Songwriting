import { currentProgression, preferFlats } from '../state/signals'
import { VoiceLeadingAnalyzer } from '../theory/voice-leading'

const analyzer = new VoiceLeadingAnalyzer()

export function VoiceLeadingHints() {
  const prog = currentProgression.value
  const flats = preferFlats.value

  const sections = prog.sections.filter(s => s.chords.length > 1)
  if (sections.length === 0) return null

  return (
    <div class="voice-leading">
      <h3 class="voice-leading__title">Voice Leading</h3>
      {sections.map(section => {
        const chords = section.chords.map(s => s.chord)
        const results = analyzer.analyzeProgression(chords)

        return (
          <div key={section.id} class="voice-leading__section">
            <span class="voice-leading__section-name">{section.label}</span>
            <div class="voice-leading__pairs">
              {results.map((result, i) => (
                <div
                  key={i}
                  class={`voice-leading__pair ${result.isSmooth ? '' : 'voice-leading__pair--rough'}`}
                >
                  <span class="voice-leading__from">
                    {section.chords[i].chord.symbol(flats)}
                  </span>
                  <span class="voice-leading__arrow">
                    {result.isSmooth ? '\u2192' : '\u26A0'}
                  </span>
                  <span class="voice-leading__to">
                    {section.chords[i + 1].chord.symbol(flats)}
                  </span>
                  <span class="voice-leading__shared">
                    {result.sharedNoteCount > 0
                      ? result.sharedNotes.map(n => n.name(flats)).join(', ')
                      : 'no common tones'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
