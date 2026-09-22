
export interface SimplePresetOption {
  id: string
  title: string
  description: string
  icon: string
  apply: () => void
}

interface SimpleModeProps {
  inputFile: string
  onInputFileChange: (filename: string) => void
  onSelectAction: (presetId: string) => void
  selectedAction: string
}

export const simpleActions = [
  {
    id: 'web-1080p',
    title: 'Web & Mobile Compatibility (1080p)',
    description: 'Standard MP4 format (H.264 + AAC + Faststart). Ideal for universal playback and sharing.',
    icon: '📱',
  },
  {
    id: 'extract-mp3',
    title: 'Extract MP3 Audio',
    description: 'Strips video and extracts the audio track in high quality MP3 (320 kbps).',
    icon: '🎵',
  },
  {
    id: 'compress-discord',
    title: 'Compress for Discord / Email (< 25MB)',
    description: 'Reduces file size and lowers bitrate while keeping decent 720p quality.',
    icon: '🗜️',
  },
  {
    id: 'remux-mp4',
    title: 'Convert MKV to MP4 (Ultra Fast)',
    description: 'Changes container to MP4 without re-encoding video/audio (lossless, instant).',
    icon: '⚡',
  },
]

export default function SimpleMode({
  inputFile,
  onInputFileChange,
  onSelectAction,
  selectedAction,
}: SimpleModeProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-line bg-panel p-6 shadow-sm">
      {/* Étape 1 : Le fichier d'entrée */}
      <div className="flex flex-col gap-2">
        <label htmlFor="simple-input" className="text-sm font-semibold text-fg">
          1. Nom de ton fichier source (vidéo ou audio)
        </label>
        <input
          id="simple-input"
          type="text"
          value={inputFile}
          onChange={(e) => onInputFileChange(e.target.value)}
          placeholder="ex: ma_video.mkv"
          className="w-full rounded border border-line bg-surface px-3 py-2 text-sm text-fg focus:border-ring focus:outline-none"
        />
        <p className="text-xs text-muted">
          Assure-toi que la commande soit lancée dans le même dossier que ce fichier.
        </p>
      </div>

      {/* Étape 2 : L'objectif recherché */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-fg">
          2. Que souhaites-tu faire ?
        </span>
        <div className="grid gap-3 sm:grid-cols-2">
          {simpleActions.map((action) => {
            const isSelected = selectedAction === action.id
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onSelectAction(action.id)}
                className={`flex flex-col gap-1.5 rounded-lg border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-ring bg-surface/80 shadow-sm ring-1 ring-ring'
                    : 'border-line bg-surface/40 hover:border-line/80 hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{action.icon}</span>
                  <span className="font-medium text-fg text-sm">{action.title}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {action.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
