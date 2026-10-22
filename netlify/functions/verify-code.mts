import type { Config } from "@netlify/functions"
import { getStore } from "@netlify/blobs"
import { MAX_ATTEMPTS, isStudent, isTeacher, json, makeToken, normEmail, sha256 } from "../lib.mts"

export default async (req: Request) => {
  const body = await req.json().catch(() => ({}))
  const email = normEmail(body.email)
  const code = String(body.code ?? "").replace(/\D/g, "")

  const store = getStore({ name: "login-codes", consistency: "strong" })
  const key = sha256(email)
  const rec = await store.get(key, { type: "json" })
  if (!rec || rec.exp < Date.now() || rec.attempts >= MAX_ATTEMPTS) {
    if (rec) await store.delete(key)
    return json({ error: "expired" }, 401)
  }
  if (sha256(`${email}:${code}`) !== rec.hash) {
    rec.attempts++
    await store.setJSON(key, rec)
    return json({ error: "wrong_code", left: MAX_ATTEMPTS - rec.attempts }, 401)
  }
  await store.delete(key)
  if (!(await isStudent(email))) return json({ error: "not_allowed" }, 403)
  return json({ token: makeToken(email), teacher: isTeacher(email) })
}

export const config: Config = { path: "/api/verify-code", method: "POST" }
