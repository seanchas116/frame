import { registerFormat, Format } from '../Format'
import { ImageFormat } from './ImageFormat'

@registerFormat
export class PNGFormat extends ImageFormat {
  readonly extensions = Object.freeze(['png'])
  readonly mime = 'image/png'
  readonly uti = 'public.png'
}
