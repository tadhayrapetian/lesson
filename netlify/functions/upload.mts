import type { Config } from "@netlify/functions"
import { isTeacher, json, sessionFrom, uploadStore } from "../lib.mts"

// Function requests are capped at ~6 MB, so the page sends files in parts of up to 3 MB.
export const MAX_PART = 3 * 1024 * 1024 + 1024

export default async (req: Request) => {
  const session = sessionFrom(req)
  if (!session || !isTeacher(session.email)) return json({ error: "unauthorized" }, 401)

  const url = new URL(req.url)
  const id = url.searchParams.get("id") ?? ""
  const part = Number(url.searchParams.get("part"))
  if (!/^[a-z0-9-]{8,64}$/.test(id) || !Number.isInteger(part) || part < 0 || part > 9) return json({ error: "bad_request" }, 400)

  const data = await req.arrayBuffer()
  if (!data.byteLength || data.byteLength > MAX_PART) return json({ error: "too_large" }, 413)
  await uploadStore().set(`${id}/${part}`, data, { metadata: { at: Date.now() } })
  return json({ ok: true })
}

export const config: Config = { path: "/api/upload", method: "POST" }
