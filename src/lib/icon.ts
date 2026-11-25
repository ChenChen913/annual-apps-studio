const ICON_SIZE = 512
const MASK_N = 4.6
let maskCache: Uint8ClampedArray | null = null

function getSquircleMask(size = ICON_SIZE) {
  if (maskCache) return maskCache
  const mask = new Uint8ClampedArray(size * size)
  const samples = 4
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let hits = 0
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const px = ((x + (sx + 0.5) / samples) / size) * 2 - 1
          const py = ((y + (sy + 0.5) / samples) / size) * 2 - 1
          if (Math.abs(px) ** MASK_N + Math.abs(py) ** MASK_N <= 1) hits += 1
        }
      }
      mask[y * size + x] = Math.round((hits / (samples * samples)) * 255)
    }
  }
  maskCache = mask
  return mask
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片读取失败'))
    }
    image.src = url
  })
}

function getAlphaBounds(data: Uint8ClampedArray, width: number, height: number) {
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  let hasTransparency = false
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha < 250) hasTransparency = true
      if (alpha > 12) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return { x: 0, y: 0, width, height, hasTransparency }
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    hasTransparency,
  }
}

export async function processIconFile(file: File): Promise<string> {
  const image = await loadImage(file)
  const maxSource = 1600
  const ratio = Math.min(1, maxSource / Math.max(image.width, image.height))
  const sourceWidth = Math.max(1, Math.round(image.width * ratio))
  const sourceHeight = Math.max(1, Math.round(image.height * ratio))

  const source = document.createElement('canvas')
  source.width = sourceWidth
  source.height = sourceHeight
  const sourceContext = source.getContext('2d', { willReadFrequently: true })
  if (!sourceContext) throw new Error('无法处理图片')
  sourceContext.imageSmoothingQuality = 'high'
  sourceContext.drawImage(image, 0, 0, sourceWidth, sourceHeight)

  const bounds = getAlphaBounds(
    sourceContext.getImageData(0, 0, sourceWidth, sourceHeight).data,
    sourceWidth,
    sourceHeight,
  )

  const side = Math.max(bounds.width, bounds.height)
  const centerX = bounds.x + bounds.width / 2
  const centerY = bounds.y + bounds.height / 2
  const cropSize = Math.max(1, Math.min(side, sourceWidth, sourceHeight))
  let cropX = Math.round(centerX - cropSize / 2)
  let cropY = Math.round(centerY - cropSize / 2)
  cropX = Math.max(0, Math.min(sourceWidth - cropSize, cropX))
  cropY = Math.max(0, Math.min(sourceHeight - cropSize, cropY))

  const target = document.createElement('canvas')
  target.width = ICON_SIZE
  target.height = ICON_SIZE
  const context = target.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('无法处理图片')
  context.imageSmoothingQuality = 'high'
  context.drawImage(source, cropX, cropY, cropSize, cropSize, 0, 0, ICON_SIZE, ICON_SIZE)

  const imageData = context.getImageData(0, 0, ICON_SIZE, ICON_SIZE)
  const mask = getSquircleMask()
  for (let i = 0, j = 0; i < imageData.data.length; i += 4, j += 1) {
    // Only multiply alpha. Changing RGB here would create a dark fringe.
    imageData.data[i + 3] = Math.round((imageData.data[i + 3] * mask[j]) / 255)
  }
  context.putImageData(imageData, 0, 0)

  return target.toDataURL('image/webp', 0.92)
}

export async function processBackgroundFile(file: File): Promise<string> {
  const image = await loadImage(file)
  const maxWidth = 2400
  const maxHeight = 1600
  const ratio = Math.min(1, maxWidth / image.width, maxHeight / image.height)
  const width = Math.max(1, Math.round(image.width * ratio))
  const height = Math.max(1, Math.round(image.height * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('无法处理背景图片')
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/webp', 0.88)
}
