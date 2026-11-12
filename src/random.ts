/** Browser-only adapter; domain operations receive this as an injected source. */
export function browserRandomUint32(): number {
  return globalThis.crypto.getRandomValues(new Uint32Array(1))[0]!
}
