import sharp, { Sharp } from 'sharp'

const fallback = (domain: string, sizeString: string | undefined): Sharp => {
  const size: number = sizeString ? parseInt(sizeString) || 256 : 256

  return sharp({
    text: {
      text: `<span foreground="#FFFFFF" background="#666666">${String.fromCodePoint(domain.codePointAt(0) ?? 32).toLocaleUpperCase()}</span>`,
      align: 'center',
      rgba: true,
      width: size,
      height: size,
      font: 'sans-serif'
    },
  }).resize(Math.floor(size/2), Math.floor(size/2), {
    fit: 'contain',
    background: { r: 102, b: 102, g: 102, alpha: 1 },
  }).extend({
    top: Math.floor(size/4),
    left: Math.floor(size/4),
    right: Math.floor(size/4),
    bottom: Math.floor(size/4),
    background: { r: 102, b: 102, g: 102, alpha: 1 },
  })
}

export default fallback
