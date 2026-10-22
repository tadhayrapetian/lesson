import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { readFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

export const CODE_TTL = 10 * 60 * 1000
export const RESEND_AFTER = 60 * 1000
export const MAX_ATTEMPTS = 5
export const SESSION_TTL = 4 * 60 * 60 * 1000

// Files from private/ are bundled with the functions via included_files.
// The working directory differs between netlify dev and production, so try both.
const roots = [process.cwd(), join(dirname(fileURLToPath(import.meta.url)), "..", "..")]

export async function readPrivate(path: string) {
  for (const root of roots) {
    try {
      return await readFile(join(root, "private", path), "utf8")
    } catch {}
  }
  return null
}

export async function isStudent(email: string) {
  const list = (await readPrivate("students.txt")) ?? ""
  return list
    .split("\n")
    .map((l) => l.trim().toLowerCase())
    .some((l) => l && !l.startsWith("#") && l === email)
}

export const normEmail = (v: unknown) => String(v ?? "").trim().toLowerCase()
export const sha256 = (v: string) => createHash("sha256").update(v).digest("hex")

const secret = () => {
  const s = Netlify.env.get("SESSION_SECRET")
  if (!s) throw new Error("SESSION_SECRET is not set")
  return s
}
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url")

export function makeToken(email: string) {
  const exp = Date.now() + SESSION_TTL
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function readToken(token: string): { email: string; exp: number } | null {
  const [payload, sig] = token.split(".")
  if (!payload || !sig) return null
  const a = Buffer.from(sig)
  const b = Buffer.from(sign(payload))
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString())
    return data.exp > Date.now() ? data : null
  } catch {
    return null
  }
}

export const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } })
