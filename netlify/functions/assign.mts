import type { Config } from "@netlify/functions"
import { assignmentHtml, assignmentSubject, assignmentText, type Assignment } from "../email.mts"
import { deleteFiles, fileRefs, loadFiles } from "../attachments.mts"
import { grantAccess, isTeacher, json, mailError, mailer, normEmail, readPrivate, sessionFrom, siteData } from "../lib.mts"

export default async (req: Request) => {
  const session = sessionFrom(req)
  if (!session || !isTeacher(session.email)) return json({ error: "unauthorized" }, 401)

  const body = await req.json().catch(() => ({}))
  const { site, lessons } = await siteData()
  const lesson = lessons.find((l) => l.slug === body.slug)
  if (!lesson || (await readPrivate(`lessons/${lesson.slug}.html`)) === null) return json({ error: "not_found" }, 404)

  const studentEmail = normEmail(body.email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) return json({ error: "bad_email" }, 400)
  const files = fileRefs(body.files)
  if (!files) return json({ error: "files_too_large" }, 413)

  const a: Assignment = {
    lesson,
    teacher: site.name || "Your teacher",
    studentEmail,
    studentName: String(body.name ?? "").slice(0, 80),
    kind: body.kind === "homework" ? "homework" : "lesson",
    due: String(body.due ?? ""),
    note: String(body.note ?? "").slice(0, 1500),
    files: files.map((f) => f.name),
    url: `${new URL(req.url).origin}/#${lesson.slug}`,
  }
  const subject = assignmentSubject(a)
  const html = assignmentHtml(a)
  if (body.preview) return json({ subject, html })

  const attachments = await loadFiles(files)
  if (!attachments) return json({ error: "upload_missing" }, 400)

  const { user, transport } = mailer()
  try {
    await transport.sendMail({ from: `"${a.teacher}" <${user}>`, to: studentEmail, subject, html, text: assignmentText(a), attachments })
  } catch (e) {
    console.error("sendMail failed", e)
    return json({ error: "mail_failed", detail: mailError(e) }, 502)
  }
  await deleteFiles(files)
  // Getting an assignment gives the student access to the site.
  await grantAccess(studentEmail, a.studentName)
  return json({ ok: true })
}

export const config: Config = { path: "/api/assign", method: "POST" }
