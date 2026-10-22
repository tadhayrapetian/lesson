import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { readFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { runInNewContext } from "node:vm"
import { getStore } from "@netlify/blobs"
import nodemailer from "nodemailer"

export const CODE_TTL = 10 * 60 * 1000
export const RESEND_AFTER = 60 * 1000
export const MAX_ATTEMPTS = 5
export const SESSION_TTL = 4 * 60 * 60 * 1000

// Files from private/ are bundled with the functions via included_files.
// The working directory differs between netlify dev and production, so try both.
const roots = [process.cwd(), join(dirname(fileURLToPath(import.meta.url)), "..", "..")]

async function readBundled(path: string) {
  for (const root of roots) {
    try {
      return await readFile(join(root, path), "utf8")
    } catch {}
  }
  return null
}

export const readPrivate = (path: string) => readBundled(join("private", path))

export type Lesson = {
  slug: string
  title: string
  topic?: string
  tag?: string | string[]
  minutes?: number
  theme?: Partial<Record<"bg" | "card" | "ink" | "muted" | "accent" | "onAccent" | "soft", string>>
}

// public/lessons.js is the single list of lessons; the functions read the same file the page loads.
export type Plan = { name: string; price?: string; period?: string; features?: string[]; featured?: boolean }

export async function siteData(): Promise<{ site: { name?: string; tagline?: string; plans?: Plan[] }; lessons: Lesson[] }> {
  const src = (await readBundled("public/lessons.js")) ?? ""
  const window: any = {}
  runInNewContext(src, { window })
  return { site: window.SITE ?? {}, lessons: window.LESSONS ?? [] }
}

export const teacherEmail = () => normEmail(Netlify.env.get("TEACHER_EMAIL") || Netlify.env.get("GMAIL_USER"))
export const isTeacher = (email: string) => !!email && email === teacherEmail()

// Students the teacher assigned a lesson to are added here, so they can log in without editing students.txt.
export const studentStore = () => getStore({ name: "students", consistency: "strong" })

export async function isStudent(email: string) {
  if (isTeacher(email)) return true
  const list = (await readPrivate("students.txt")) ?? ""
  const inFile = list
    .split("\n")
    .map((l) => l.trim().toLowerCase())
    .some((l) => l && !l.startsWith("#") && l === email)
  return inFile || (await studentStore().get(email)) !== null
}

export async function listStudents() {
  const list = (await readPrivate("students.txt")) ?? ""
  const fromFile = list.split("\n").map((l) => l.trim().toLowerCase()).filter((l) => l && !l.startsWith("#"))
  const { blobs } = await studentStore().list()
  const names: Record<string, string> = {}
  for (const b of blobs) {
    const v = await studentStore().get(b.key, { type: "json" })
    if (v?.name) names[b.key] = v.name
  }
  const all = [...new Set([...fromFile, ...blobs.map((b) => b.key)])].filter((e) => !isTeacher(e)).sort()
  return all.map((email) => ({ email, name: names[email] ?? "" }))
}

export function sessionFrom(req: Request) {
  const auth = req.headers.get("authorization") ?? ""
  return readToken(auth.replace(/^Bearer\s+/i, ""))
}

// Short, non-secret reason (e.g. "EAUTH 535") so a failed send can be diagnosed from the browser.
export const mailError = (e: any) => [e?.code, e?.responseCode].filter(Boolean).join(" ") || "unknown"

export function mailer() {
  const user = Netlify.env.get("GMAIL_USER")
  const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass: Netlify.env.get("GMAIL_APP_PASSWORD") } })
  return { user, transport }
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
