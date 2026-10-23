import type { Config, Context } from "@netlify/functions"
import { purchaseBuyerHtml, purchaseTeacherHtml, purchaseText, type Purchase } from "../email.mts"
import { json, mailError, mailer, normEmail, overLimit, readPrivate, siteData, teacherEmail } from "../lib.mts"

const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n)

// Someone (usually another teacher) asks to buy a lesson. They never get access to the site:
// the request goes to the teacher with the lesson file attached, to forward after payment.
export default async (req: Request, context: Context) => {
  const body = await req.json().catch(() => ({}))
  if (clip(body.website, 200)) return json({ ok: true })

  const name = clip(body.name, 80)
  const email = normEmail(body.email).slice(0, 120)
  if (!name) return json({ error: "bad_name" }, 400)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "bad_email" }, 400)

  const { site, lessons } = await siteData()
  const lesson = lessons.find((l) => l.slug === body.slug)
  const file = lesson && (await readPrivate(`lessons/${lesson.slug}.html`))
  if (!lesson || !file) return json({ error: "not_found" }, 404)
  if (await overLimit(context.ip)) return json({ error: "too_many" }, 429)

  const p: Purchase = {
    teacher: site.name || "Teacher",
    lesson,
    name,
    email,
    role: clip(body.role, 60),
    message: clip(body.message, 2000),
    siteUrl: new URL(req.url).origin,
  }
  const { user, transport } = mailer()
  try {
    await transport.sendMail({
      from: `"${p.teacher} website" <${user}>`,
      to: teacherEmail(),
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `Lesson request: ${lesson.title} from ${name}`,
      html: purchaseTeacherHtml(p),
      text: purchaseText(p),
      attachments: [{ filename: `${lesson.slug}.html`, content: file, contentType: "text/html" }],
    })
  } catch (e) {
    console.error("sendMail failed", e)
    return json({ error: "mail_failed", detail: mailError(e) }, 502)
  }
  await transport
    .sendMail({ from: `"${p.teacher}" <${user}>`, to: email, subject: `Your request for "${lesson.title}"`, html: purchaseBuyerHtml(p), text: purchaseText(p) })
    .catch((e) => console.error("confirmation failed", e))
  return json({ ok: true })
}

export const config: Config = { path: "/api/buy", method: "POST" }
