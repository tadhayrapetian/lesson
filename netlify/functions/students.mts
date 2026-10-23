import type { Config } from "@netlify/functions"
import { welcomeHtml, welcomeSubject, welcomeText } from "../email.mts"
import { grantAccess, isTeacher, json, listStudents, mailError, mailer, normEmail, readPrivate, sessionFrom, siteData, studentStore } from "../lib.mts"

export default async (req: Request) => {
  const session = sessionFrom(req)
  if (!session || !isTeacher(session.email)) return json({ error: "unauthorized" }, 401)
  if (req.method === "GET") return json({ students: await listStudents() })

  const body = await req.json().catch(() => ({}))
  const email = normEmail(body.email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "bad_email" }, 400)

  if (body.action === "remove") {
    const inFile = ((await readPrivate("students.txt")) ?? "").split("\n").some((l) => l.trim().toLowerCase() === email)
    if (inFile) return json({ error: "in_file" }, 409)
    await studentStore().delete(email)
    return json({ ok: true, students: await listStudents() })
  }

  const name = String(body.name ?? "").trim().slice(0, 80)
  await grantAccess(email, name)
  if (body.welcome) {
    const { site } = await siteData()
    const w = { teacher: site.name || "Your teacher", siteUrl: new URL(req.url).origin, name, email }
    const { user, transport } = mailer()
    try {
      await transport.sendMail({ from: `"${w.teacher}" <${user}>`, to: email, subject: welcomeSubject(w), html: welcomeHtml(w), text: welcomeText(w) })
    } catch (e) {
      console.error("welcome failed", e)
      return json({ ok: true, mail: "failed", detail: mailError(e), students: await listStudents() })
    }
  }
  return json({ ok: true, students: await listStudents() })
}

export const config: Config = { path: "/api/students", method: ["GET", "POST"] }
