// http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
function hsv2rgb (h: number, s: number, v: number) {
  while (h >= 360) {
    h -= 360
  }
  while (h < 0) {
    h += 360
  }
  const c = v * s
  const hh = h / 60
  const x = c * (1 - Math.abs(hh % 2 - 1))
  const m = v - c

  let rgb: [number, number, number] = [0, 0, 0]

  switch (Math.floor(hh)) {
    case 0:
      rgb = [c, x, 0]
      break
    case 1:
      rgb = [x, c, 0]
      break
    case 2:
      rgb = [0, c, x]
      break
    case 3:
      rgb = [0, x, c]
      break
    case 4:
      rgb = [x, 0, c]
      break
    case 5:
      rgb = [c, 0, x]
      break
  }

  return {
    r: rgb[0] + m,
    g: rgb[1] + m,
    b: rgb[2] + m
  }
}

// http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
function rgb2hsv (r: number, g: number, b: number) {
  const rr = r
  const gg = g
  const bb = b
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const delta = max - min

  let h = 0
  if (delta === 0) {
    h = 0
  } else if (rr === max) {
    h = 60 * (((gg - bb) / delta) % 6)
  } else if (gg === max) {
    h = 60 * ((bb - rr) / delta + 2)
  } else if (bb === max) {
    h = 60 * ((rr - gg) / delta + 4)
  }

  const s = max === 0 ? 0 : (delta / max)
  const v = max

  return { h, s, v }
}

export class RGBColor {
  constructor (public r: number, public g: number, public b: number, public a: number) {
  }

  members () {
    return [this.r, this.g, this.b, this.a]
  }

  equals (other: RGBColor) {
    return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a
  }

  toString () {
    const { r, g, b, a } = this
    const rr = Math.round(r * 255)
    const gg = Math.round(g * 255)
    const bb = Math.round(b * 255)
    return `rgba(${rr},${gg},${bb},${a})`
  }

}

export class HSVColor {
  static transparent = new HSVColor(0, 0, 0, 0)

  // h: 0 ... 360
  // s: 0 ... 1
  // v: 0 ... 1
  // a: 0 ... 1
  constructor (public h: number, public s: number, public v: number, public a = 1) {
  }

  static fromRGB (rgb: RGBColor) {
    const hsv = rgb2hsv(rgb.r, rgb.g, rgb.b)
    return new HSVColor(hsv.h, hsv.s, hsv.v, rgb.a)
  }

  toRGB () {
    const { h, s, v, a } = this
    const { r, g, b } = hsv2rgb(h, s, v)
    return new RGBColor(r, g, b, a)
  }

  equals (other: HSVColor) {
    return this.h === other.h && this.s === other.s && this.v === other.v && this.a === other.a
  }
}
