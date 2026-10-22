import type { Config } from "@netlify/functions"
import { getStore } from "@netlify/blobs"
import { timingSafeEqual } from "node:crypto"
import { MAX_ATTEMPTS, isStudent, isTeacher, json, makeToken, normEmail, sha256 } from "../lib.mts"

const LOCK_AFTER = 5
const LOCK_FOR = 15 * 60 * 1000

// The teacher can log in with ADMIN_PASSWORD instead of an emailed code.
// Wrong guesses lock this way in for 15 minutes; emailed codes keep working.
async function passwordLogin(email: string, password: string) {
  const expected = Netlify.env.get("ADMIN_PASSWORD") ?? ""
  const store = getStore({ name: "admin-login", consistency: "strong" })
  const rec = (await store.get("fails", { type: "json" })) ?? { count: 0, since: 0 }
  if (rec.count >= LOCK_AFTER && Date.now() - rec.since < LOCK_FOR) return json({ error: "locked" }, 429)
  const a = Buffer.from(sha256(password))
  const ok = !!expected && isTeacher(email) && timingSafeEqual(a, Buffer.from(sha256(expected)))
  if (!ok) {
    const fresh = Date.now() - rec.since >= LOCK_FOR
    await store.setJSON("fails", { count: fresh ? 1 : rec.count + 1, since: fresh ? Date.now() : rec.since })
    return json({ error: "wrong_password" }, 401)
  }
  await store.delete("fails")
  return json({ token: makeToken(email), teacher: true })
}

export default async (req: Request) => {
  const body = await req.json().catch(() => ({}))
  const email = normEmail(body.email)
  if (body.password !== undefined) return passwordLogin(email, String(body.password))
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
