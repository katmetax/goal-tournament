export function encodeShareToken(winners: string[]): string {
  const data = { w: winners, d: 'playful', c: 'paper' }
  const bytes = new TextEncoder().encode(JSON.stringify(data))
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''))
}

export function decodeShareToken(token: string): string[] | null {
  try {
    const bytes = Uint8Array.from(atob(token), (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const data = JSON.parse(json) as { w: string[] }
    return Array.isArray(data.w) ? data.w : null
  } catch {
    return null
  }
}
