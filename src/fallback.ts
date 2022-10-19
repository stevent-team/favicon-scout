import sharp, { Sharp } from 'sharp'

const fallback = (domain: string, size = 256): Sharp => {
  return sharp({
    text: {
      text: `<span foreground="#FFFFFF" background="#666666">${String.fromCodePoint(domain.codePointAt(0) ?? 32).toLocaleUpperCase()}</span>`,
      align: 'center',
      rgba: true,
      width: size,
      height: size,
      font: 'sans-serif'
    },
  }).resize(Math.ceil(size/2), Math.ceil(size/2), {
    fit: 'contain',
    background: { r: 102, b: 102, g: 102, alpha: 1 },
  }).extend({
    top: Math.ceil(size/4),
    left: Math.ceil(size/4),
    right: Math.ceil(size/4),
    bottom: Math.ceil(size/4),
    background: { r: 102, b: 102, g: 102, alpha: 1 },
  })
}

export default fallback
