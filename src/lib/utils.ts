import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Base64URL helpers (Unicode-safe, SSR/CSR 모두 동작) */
export function toBase64(bytes: Uint8Array): string {
  if (typeof window === "undefined") return Buffer.from(bytes).toString("base64");
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
export function fromBase64(b64: string): Uint8Array {
  if (typeof window === "undefined") return new Uint8Array(Buffer.from(b64, "base64"));
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
export function base64UrlEncode(obj: unknown): string {
  const json = JSON.stringify(obj ?? {});
  const bytes = new TextEncoder().encode(json);
  const b64 = toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return b64;
}
export function base64UrlDecode<T = unknown>(b64url: string): T | null {
  if (!b64url) return null;
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (b64.length % 4)) % 4;
  const padded = b64 + "=".repeat(padLen);
  try {
    const bytes = fromBase64(padded);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as T;
  } catch (_) {
    return null;
  }
}
