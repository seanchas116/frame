const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')!

export function imageDataToURL (data: ImageData) {
  canvas.width = data.width
  canvas.height = data.height
  context.putImageData(data, 0, 0)
  return canvas.toDataURL()
}
