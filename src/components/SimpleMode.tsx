
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
    title: 'Compatibilité Web & Mobile (1080p)',
    description: 'Format standard universel (MP4 H.264 + AAC + Faststart). Idéal pour partager sans prise de tête.',
    icon: '🎬',
  },
  {
    id: 'extract-mp3',
    title: 'Extraire la musique en MP3',
    description: 'Supprime la vidéo et conserve uniquement la piste audio en haute qualité MP3 (320 kbps).',
    icon: '🎵',
  },
  {
    id: 'compress-discord',
    title: 'Compresser pour Discord / Mail (< 25 Mo)',
    description: 'Réduit drastiquement le poids de la vidéo (720p, bitrate optimisé) pour passer sous la limite d\'envoi.',
    icon: '📦',
  },
  {
    id: 'remux-mp4',
    title: 'Changer le conteneur en MP4 (Ultra rapide)',
    description: 'Ne ré-encode rien (copie brute des flux). Pratique si ton lecteur refuse un fichier MKV.',
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