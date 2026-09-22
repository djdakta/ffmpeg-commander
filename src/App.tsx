import Banner from '@/components/Banner'
import CommandOutput from '@/components/CommandOutput'
import FileIO from '@/components/FileIO'
import Footer from '@/components/Footer'
import JsonViewer from '@/components/JsonViewer'
import { PageAbout, PageHeading } from '@/components/PageIntro'
import Navbar from '@/components/Navbar'
import Toolbar from '@/components/Toolbar'
import SimpleMode from '@/components/SimpleMode'
import AudioSection from '@/components/sections/AudioSection'
import FiltersSection from '@/components/sections/FiltersSection'
import FormatSection from '@/components/sections/FormatSection'
import OptionsSection from '@/components/sections/OptionsSection'
import VideoSection from '@/components/sections/VideoSection'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Tabs from '@/components/ui/Tabs'
import { useState } from 'react'
import Queue from '@/components/Queue'
import { useFfmpegd } from '@/hooks/useFfmpegd'
import { useFfmpegForm } from '@/hooks/useFfmpegForm'
import { usePresets } from '@/hooks/usePresets'
import util from '@/lib/util'

const selectClass =
  'w-full rounded border border-line bg-panel px-2 py-1.5 text-sm text-fg ' +
  'focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none'

export default function App() {
  const {
    form, cmd, conflicts, update, updateFormat, updateVideo, updateOptions, reset, setForm,
  } = useFfmpegForm()
  const preset = usePresets({ form, setForm })
  const ffmpegd = useFfmpegd()
  const [showJson, setShowJson] = useState(false)
  const [isSimpleMode, setIsSimpleMode] = useState(true) // Mode Simple par défaut pour les proches
  const [simpleActionId, setSimpleActionId] = useState('web-1080p')
  const container = form.format.container ?? 'mp4'

  // Logique d'application des actions simples
  const applySimpleAction = (actionId: string) => {
    setSimpleActionId(actionId)

    if (actionId === 'web-1080p') {
      preset.select('web-mp4-1080p')
    } else if (actionId === 'extract-mp3') {
      update('format', { container: 'mp3' })
      update('video', { codec: 'none' })
      update('audio', { codec: 'lame', quality: '320k' })
      update('io', { output: 'musique.mp3' })
    } else if (actionId === 'compress-discord') {
      preset.select('web-mp4-720p')
      update('video', { crf: '28', preset: 'slow' })
      update('audio', { quality: '96k' })
      update('io', { output: 'video_discord.mp4' })
    } else if (actionId === 'remux-mp4') {
      update('format', { container: 'mp4' })
      update('video', { codec: 'copy' })
      update('audio', { codec: 'copy' })
      update('io', { output: 'video_remux.mp4' })
    }
  }

  const tabs = [
    {
      id: 'format',
      label: 'Format',
      content: (
        <FormatSection value={form.format} onChange={updateFormat} />
      ),
    },
    {
      id: 'video',
      label: 'Video',
      content: (
        <VideoSection
          value={form.video}
          container={container}
          copyConflict={conflicts.video}
          onChange={updateVideo}
        />
      ),
    },
    {
      id: 'audio',
      label: 'Audio',
      content: (
        <AudioSection
          value={form.audio}
          container={container}
          copyConflict={conflicts.audio}
          onChange={(patch) => update('audio', patch)}
        />
      ),
    },
    {
      id: 'filters',
      label: 'Filters',
      content: (
        <FiltersSection
          value={form.filters}
          conflicts={conflicts}
          onChange={(patch) => update('filters', patch)}
        />
      ),
    },
    {
      id: 'options',
      label: 'Options',
      content: (
        <OptionsSection
          value={form.options}
          onChange={updateOptions}
          ffmpegdEnabled={ffmpegd.enabled}
          ffmpegdConnected={ffmpegd.connected}
          onFfmpegdChange={ffmpegd.setEnabled}
          ffmpegdAddress={ffmpegd.address}
          onFfmpegdAddressChange={ffmpegd.setAddress}
        />
      ),
    },
  ]

  const builder = (
    <div className="flex flex-col gap-5">
      {/* Commutateur de Mode : Simple vs Avancé */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Mode d'interface :</span>
          <div className="inline-flex rounded-lg border border-line bg-surface p-1">
            <button
              type="button"
              onClick={() => setIsSimpleMode(true)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                isSimpleMode ? 'bg-panel text-fg shadow-sm' : 'text-muted hover:text-fg'
              }`}
            >
              ✨ Simple (Débutant)
            </button>
            <button
              type="button"
              onClick={() => setIsSimpleMode(false)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                !isSimpleMode ? 'bg-panel text-fg shadow-sm' : 'text-muted hover:text-fg'
              }`}
            >
              ⚙️ Avancé (Expert)
            </button>
          </div>
        </div>
      </div>

      <PageHeading />

      {/* Affichage conditionnel selon le mode sélectionné */}
      {isSimpleMode ? (
        <SimpleMode
          inputFile={form.io.input}
          onInputFileChange={(filename) => update('io', { input: filename })}
          onSelectAction={applySimpleAction}
          selectedAction={simpleActionId}
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Preset" htmlFor="preset">
              <select
                id="preset"
                className={selectClass}
                value={preset.presetId}
                onChange={(e) => preset.select(e.target.value)}
              >
                {preset.groups.map((group) => (
                  <optgroup key={group.id} label={group.name}>
                    {group.data.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>

            {preset.isSaved ? (
              <Field label="Preset name" htmlFor="preset-name">
                <Input id="preset-name" value={preset.presetName ?? ''} onChange={preset.rename} />
              </Field>
            ) : null}
          </div>

          <FileIO
            value={form.io}
            onChange={(patch) => update('io', patch)}
            ffmpegdEnabled={ffmpegd.enabled}
            ffmpegdConnected={ffmpegd.connected}
          />

          <Tabs tabs={tabs} />
        </>
      )}

      {/* Résultat et commande FFmpeg toujours visibles et copiables */}
      <div className="flex flex-col gap-2">
        <CommandOutput cmd={cmd} />
        <p className="text-xs text-muted italic">
          *Generated options may vary based on your FFmpeg version and build configuration.
        </p>
      </div>

      <Toolbar
        cmd={cmd}
        isSavedPreset={preset.isSaved}
        canEncode={ffmpegd.enabled && ffmpegd.connected}
        encoding={ffmpegd.encoding}
        onEncode={() =>
          ffmpegd.enqueue(form.io.input, form.io.output, util.transformToJSON(form))
        }
        showJson={showJson}
        onToggleJson={() => setShowJson((v) => !v)}
        onSave={() => preset.save()}
        onSaveAsNew={() => preset.save(true)}
        onDelete={preset.remove}
        onReset={() => {
          reset()
          preset.select('custom')
        }}
      />

      {showJson ? <JsonViewer form={form} /> : null}

      <PageAbout />
    </div>
  )

  return (
    <div className="relative min-h-screen bg-surface text-fg">
      <Navbar />
      <Banner />

      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
        <Tabs
          align="right"
          tabs={[
            { id: 'builder', label: 'Builder', content: builder },
            ...(ffmpegd.enabled
              ? [
                  {
                    id: 'queue',
                    label: ffmpegd.jobs.length ? `Queue (${ffmpegd.jobs.length})` : 'Queue',
                    content: (
                      <Queue
                        jobs={ffmpegd.jobs}
                        progress={ffmpegd.progress}
                        connected={ffmpegd.connected}
                        onCancel={ffmpegd.cancel}
                        onRestart={ffmpegd.restart}
                        onToggleDetails={ffmpegd.toggleDetails}
                        onClear={ffmpegd.clear}
                      />
                    ),
                  },
                ]
              : []),
          ]}
        />
      </main>

      <Footer />
    </div>
  )
}
