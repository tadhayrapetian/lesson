import type { Config } from "@netlify/functions"
import { getStore } from "@netlify/blobs"
import { randomInt } from "node:crypto"
import nodemailer from "nodemailer"
import { CODE_TTL, RESEND_AFTER, isStudent, json, normEmail, sha256 } from "../lib.mts"

export default async (req: Request) => {
  const { email: raw } = await req.json().catch(() => ({}))
  const email = normEmail(raw)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "bad_email" }, 400)
  if (!(await isStudent(email))) return json({ error: "not_allowed" }, 403)

  const store = getStore({ name: "login-codes", consistency: "strong" })
  const key = sha256(email)
  const prev = await store.get(key, { type: "json" })
  if (prev && Date.now() - prev.sentAt < RESEND_AFTER) {
    return json({ error: "too_soon", wait: Math.ceil((RESEND_AFTER - (Date.now() - prev.sentAt)) / 1000) }, 429)
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0")
  await store.setJSON(key, { hash: sha256(`${email}:${code}`), sentAt: Date.now(), exp: Date.now() + CODE_TTL, attempts: 0 })

  const user = Netlify.env.get("GMAIL_USER")
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: Netlify.env.get("GMAIL_APP_PASSWORD") },
  })
  try {
    await transport.sendMail({
      from: `"English lessons" <${user}>`,
      to: email,
      subject: `Your lesson code: ${code}`,
      text: `Your code: ${code}\n\nIt works for 10 minutes. If you did not ask for it, just ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;color:#162A2C"><p>Your code to open the lesson:</p><p style="font-size:32px;letter-spacing:6px;margin:12px 0"><b>${code}</b></p><p style="color:#686867">It works for 10 minutes. If you did not ask for it, just ignore this email.</p></div>`,
    })
  } catch (e) {
    console.error("sendMail failed", e)
    await store.delete(key)
    return json({ error: "mail_failed" }, 502)
  }
  return json({ ok: true })
}

export const config: Config = { path: "/api/request-code", method: "POST" }
