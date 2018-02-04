import { registerFormat } from '../Format'
import { ImageFormat } from './ImageFormat'

@registerFormat
export class JPEGFormat extends ImageFormat {
  readonly extensions = Object.freeze(['jpg', 'jpeg'])
  readonly mime = 'image/jpeg'
  readonly uti = 'public.jpeg'
}
