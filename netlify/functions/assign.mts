import type { Config } from "@netlify/functions"
import { assignmentHtml, assignmentSubject, assignmentText, type Assignment } from "../email.mts"
import { grantAccess, isTeacher, json, mailError, mailer, normEmail, readPrivate, sessionFrom, siteData, uploadStore } from "../lib.mts"

// Gmail accepts messages up to 25 MB; attachments grow by about a third when encoded.
const MAX_FILES_BYTES = 18 * 1024 * 1024

type FileRef = { id: string; name: string; type: string; size: number; parts: number }

function fileRefs(raw: unknown): FileRef[] | null {
  if (raw === undefined) return []
  if (!Array.isArray(raw) || raw.length > 10) return null
  const files = raw.map((f) => ({
    id: String(f?.id ?? ""),
    name: String(f?.name ?? "").replace(/[\\/\r\n]/g, "_").slice(0, 120) || "file",
    type: String(f?.type ?? "") || "application/octet-stream",
    size: Number(f?.size),
    parts: Number(f?.parts),
  }))
  const ok = files.every((f) => /^[a-z0-9-]{8,64}$/.test(f.id) && Number.isInteger(f.parts) && f.parts >= 1 && f.parts <= 10)
  const total = files.reduce((n, f) => n + (f.size || 0), 0)
  return ok && total <= MAX_FILES_BYTES ? files : null
}

async function loadFile(f: FileRef) {
  const parts: Buffer[] = []
  for (let i = 0; i < f.parts; i++) {
    const data = await uploadStore().get(`${f.id}/${i}`, { type: "arrayBuffer" })
    if (data === null) return null
    parts.push(Buffer.from(data))
  }
  return { filename: f.name, content: Buffer.concat(parts), contentType: f.type }
}

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

  const attachments = []
  for (const f of files) {
    const file = await loadFile(f)
    if (!file) return json({ error: "upload_missing" }, 400)
    attachments.push(file)
  }

  const { user, transport } = mailer()
  try {
    await transport.sendMail({ from: `"${a.teacher}" <${user}>`, to: studentEmail, subject, html, text: assignmentText(a), attachments })
  } catch (e) {
    console.error("sendMail failed", e)
    return json({ error: "mail_failed", detail: mailError(e) }, 502)
  }
  await Promise.all(files.flatMap((f) => Array.from({ length: f.parts }, (_, i) => uploadStore().delete(`${f.id}/${i}`))))
  // Getting an assignment gives the student access to the site.
  await grantAccess(studentEmail, a.studentName)
  return json({ ok: true })
}

export const config: Config = { path: "/api/assign", method: "POST" }
