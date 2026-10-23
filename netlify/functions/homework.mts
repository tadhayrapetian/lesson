import type { Config } from "@netlify/functions"
import { deleteFiles, fileRefs, loadFiles } from "../attachments.mts"
import { homeworkHtml, homeworkText, type Homework } from "../email.mts"
import { isStudent, json, listStudents, mailError, mailer, sessionFrom, siteData, teacherEmail } from "../lib.mts"

// A student hands in homework from inside a lesson; it arrives in the teacher's inbox.
export default async (req: Request) => {
  const session = sessionFrom(req)
  if (!session || !(await isStudent(session.email))) return json({ error: "unauthorized" }, 401)

  const body = await req.json().catch(() => ({}))
  const { site, lessons } = await siteData()
  const lesson = lessons.find((l) => l.slug === body.slug)
  if (!lesson) return json({ error: "not_found" }, 404)

  const answer = String(body.answer ?? "").trim().slice(0, 20000)
  const files = fileRefs(body.files)
  if (!files) return json({ error: "files_too_large" }, 413)
  if (!answer && !files.length) return json({ error: "empty" }, 400)

  const known = (await listStudents()).find((s) => s.email === session.email)
  const h: Homework = {
    teacher: site.name || "Teacher",
    lesson,
    studentEmail: session.email,
    studentName: String(body.name ?? "").trim().slice(0, 80) || known?.name || "",
    answer,
    files: files.map((f) => f.name),
    siteUrl: new URL(req.url).origin,
  }
  const attachments = await loadFiles(files)
  if (!attachments) return json({ error: "upload_missing" }, 400)

  const who = h.studentName || h.studentEmail
  const { user, transport } = mailer()
  try {
    await transport.sendMail({
      from: `"${who.replace(/"/g, "")} via website" <${user}>`,
      to: teacherEmail(),
      replyTo: h.studentEmail,
      subject: `Homework from ${who}: ${lesson.title}`,
      html: homeworkHtml(h),
      text: homeworkText(h),
      attachments,
    })
  } catch (e) {
    console.error("sendMail failed", e)
    return json({ error: "mail_failed", detail: mailError(e) }, 502)
  }
  await deleteFiles(files)
  return json({ ok: true })
}

export const config: Config = { path: "/api/homework", method: "POST" }
