import type { Config, Context } from "@netlify/functions"
import { getStore } from "@netlify/blobs"
import { requestStudentHtml, requestTeacherHtml, requestText, type Request_ } from "../email.mts"
import { json, mailError, mailer, makeGrantLink, normEmail, sha256, siteData, teacherEmail } from "../lib.mts"

const LIMIT = 5
const WINDOW = 60 * 60 * 1000
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n)

export default async (req: Request, context: Context) => {
  const body = await req.json().catch(() => ({}))
  // Bots fill the hidden "website" field; pretend it worked.
  if (clip(body.website, 200)) return json({ ok: true })

  const name = clip(body.name, 80)
  const email = normEmail(body.email).slice(0, 120)
  if (!name) return json({ error: "bad_name" }, 400)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "bad_email" }, 400)

  const rate = getStore({ name: "contact-rate", consistency: "strong" })
  const key = sha256(context.ip || "unknown")
  const prev = await rate.get(key, { type: "json" })
  const fresh = !prev || Date.now() - prev.start > WINDOW
  if (!fresh && prev.count >= LIMIT) return json({ error: "too_many" }, 429)
  await rate.setJSON(key, fresh ? { start: Date.now(), count: 1 } : { ...prev, count: prev.count + 1 })

  const { site } = await siteData()
  const plan = body.kind === "plan" ? site.plans?.[Number(body.plan)] : undefined
  const what =
    body.kind === "question" ? "A question" : plan ? `${plan.name}${plan.period ? `, ${plan.period}` : ""}${plan.price ? ` (${plan.price})` : ""}` : "A trial lesson"
  const r: Request_ = {
    teacher: site.name || "Your teacher",
    name,
    email,
    what,
    level: clip(body.level, 20),
    times: clip(body.times, 200),
    message: clip(body.message, 2000),
    siteUrl: new URL(req.url).origin,
  }
  r.grantUrl = makeGrantLink(r.siteUrl, email, name)

  const { user, transport } = mailer()
  try {
    await transport.sendMail({
      from: `"${r.teacher} website" <${user}>`,
      to: teacherEmail(),
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `New request from ${name}: ${what}`,
      html: requestTeacherHtml(r),
      text: requestText(r),
    })
  } catch (e) {
    console.error("sendMail failed", e)
    return json({ error: "mail_failed", detail: mailError(e) }, 502)
  }
  // The confirmation is a courtesy; the teacher already has the request if it fails.
  await transport
    .sendMail({ from: `"${r.teacher}" <${user}>`, to: email, subject: "Thank you, I got your message", html: requestStudentHtml(r), text: requestText(r) })
    .catch((e) => console.error("confirmation failed", e))
  return json({ ok: true })
}

export const config: Config = { path: "/api/contact", method: "POST" }
