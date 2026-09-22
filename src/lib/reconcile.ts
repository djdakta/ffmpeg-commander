import form from '@/lib/form'
import { retargetExtension } from '@/lib/filename'
import type { IFFMpegOptionsForm } from '@/lib/types'

interface Supported {
  value: string
  supported?: string[] | null
}

const isSupported = (options: Supported[], value: string, against: string) => {
  const option = options.find((o) => o.value === value)
  return !option || !option.supported || option.supported.includes(against)
}

const firstSupported = (options: Supported[], against: string, fallback: string) =>
  options.find((o) => !o.supported || o.supported.includes(against))?.value ?? fallback

export function reconcile(next: IFFMpegOptionsForm): IFFMpegOptionsForm {
  const container = next.format.container ?? 'mp4'
  const video = { ...next.video }
  const audio = { ...next.audio }

  // 1. Validation des codecs selon le conteneur
  if (!isSupported(form.codecs.video as Supported[], video.codec, container)) {
    video.codec = firstSupported(form.codecs.video as Supported[], container, 'copy')
  }
  if (!isSupported(form.codecs.audio as Supported[], audio.codec, container)) {
    audio.codec = firstSupported(form.codecs.audio as Supported[], container, 'copy')
  }

  // 2. Options dépendantes du codec vidéo
  if (!isSupported(form.presets as Supported[], video.preset, video.codec)) {
    video.preset = 'none'
  }
  if (!isSupported(form.profiles as Supported[], String(video.profile), video.codec)) {
    video.profile = 'none'
  }
  if (!isSupported(form.tunes as Supported[], video.tune, video.codec)) {
    video.tune = 'none'
  }

  // 3. Garde-fou Faststart : uniquement valide pour MP4 et MOV
  const movContainers = ['mp4', 'mov', 'm4v']
  if (!movContainers.includes(container.toLowerCase())) {
    video.faststart = false
  }

  return {
    ...next,
    video,
    audio,
    io: { ...next.io, output: retargetExtension(next.io.output, container) },
  }
}
