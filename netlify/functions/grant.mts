import type { Config } from "@netlify/functions"
import { welcomeHtml, welcomeSubject, welcomeText } from "../email.mts"
import { grantAccess, json, mailer, readSigned, siteData } from "../lib.mts"

// Opened from the "Give access" button in a request email. The signed link is the
// teacher's permission; the page posts it only after the teacher presses Confirm.
export default async (req: Request) => {
  const body = await req.json().catch(() => ({}))
  const grant = readSigned(String(body.token ?? ""))
  if (!grant || grant.typ !== "grant" || typeof grant.email !== "string") return json({ error: "bad_link" }, 400)
  const name = String(grant.name ?? "")
  if (!body.confirm) return json({ email: grant.email, name })

  const added = await grantAccess(grant.email, name)
  if (added) {
    const { site } = await siteData()
    const w = { teacher: site.name || "Your teacher", siteUrl: new URL(req.url).origin, name, email: grant.email }
    const { user, transport } = mailer()
    await transport
      .sendMail({ from: `"${w.teacher}" <${user}>`, to: w.email, subject: welcomeSubject(w), html: welcomeHtml(w), text: welcomeText(w) })
      .catch((e) => console.error("welcome failed", e))
  }
  return json({ ok: true, added, email: grant.email, name })
}

export const config: Config = { path: "/api/grant", method: "POST" }
