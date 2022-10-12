const fallback = (domain: string): Buffer => {
  const svg = `<?xml version="1.0" encoding="utf-8"?>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <rect fill="#666666" width="256" height="256"/>
    <text fill="#FFFFFF" x="50%" y="50%" dominant-baseline="central" dy=".35em" text-anchor="middle" style="font-family:sans-serif;font-size:150px;">${String.fromCodePoint(domain.codePointAt(0) ?? 32).toLocaleUpperCase()}</text>
  </svg>`

  return Buffer.from(svg)
}

export default fallback
