import type { ImgHTMLAttributes } from 'react'
import { assetUrl } from '@/lib/assets'

interface AssetImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  path: string
  ext?: string
}

/** Resolves an image from src/assets/images by its path (source: AssetImage). */
export function AssetImage({ path, ext = 'svg', alt = '', ...rest }: AssetImageProps) {
  return <img src={assetUrl(path, ext)} alt={alt} {...rest} />
}
