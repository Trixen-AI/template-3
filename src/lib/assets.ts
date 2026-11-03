const images = import.meta.glob<string>('../assets/images/**/*.{svg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byPath = new Map(Object.entries(images).map(([file, url]) => [file.replace('../assets/images/', '').toLowerCase(), url]))

/** URL of an image in src/assets/images by its path without extension (source: AssetImage lookup). */
export function assetUrl(path: string, ext = 'svg') {
  return byPath.get(`${path}.${ext}`.toLowerCase()) ?? ''
}
