import type { Lesson } from "./lib.mts"

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

const DEFAULT_THEME = {
  bg: "#F4EFE6", card: "#FEFCF6", ink: "#162A2C", muted: "#686867",
  accent: "#5E6C5B", onAccent: "#FEFCF6", soft: "#EFEADF",
}

export type Assignment = {
  lesson: Lesson
  teacher: string
  studentEmail: string
  studentName?: string
  kind: "lesson" | "homework"
  due?: string
  note?: string
  files?: string[]
  url: string
}

export function formatDue(due?: string) {
  if (!due || !/^\d{4}-\d{2}-\d{2}$/.test(due)) return ""
  return new Date(`${due}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })
}

export function assignmentSubject(a: Assignment) {
  return a.kind === "homework"
    ? `${a.teacher} assigned you homework: ${a.lesson.title}`
    : `${a.teacher} shared a lesson with you: ${a.lesson.title}`
}

// Table layout with inline styles: the only thing Gmail, Outlook and Apple Mail all render the same way.
export function assignmentHtml(a: Assignment) {
  const t = { ...DEFAULT_THEME, ...a.lesson.theme }
  const serif = `Georgia,'Times New Roman',serif`
  const sans = `'Helvetica Neue',Helvetica,Arial,sans-serif`
  const due = formatDue(a.due)
  const first = (a.studentName ?? "").trim().split(/\s+/)[0]
  const eyebrow = a.kind === "homework" ? "New homework" : "New lesson"
  const lead =
    a.kind === "homework"
      ? `Your teacher <b>${esc(a.teacher)}</b> has assigned you homework.`
      : `Your teacher <b>${esc(a.teacher)}</b> has shared a lesson with you.`
  const meta = [[a.lesson.tag ?? []].flat().join(" & "), a.lesson.minutes ? `${a.lesson.minutes} min` : ""].filter(Boolean).map(esc).join(" &nbsp;·&nbsp; ")
  const note = (a.note ?? "").trim()

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${esc(assignmentSubject(a))}</title>
<style>
@media (max-width:620px){.wrap{width:100%!important}.px{padding-left:24px!important;padding-right:24px!important}.title{font-size:40px!important}}
a{color:${t.accent}}
</style></head>
<body style="margin:0;padding:0;background:${t.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${t.bg};">${esc(a.lesson.title)}${a.lesson.topic ? ` — ${esc(a.lesson.topic)}` : ""}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${t.bg};">
<tr><td align="center" style="padding:32px 12px 40px;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

<tr><td class="px" style="padding:0 8px 18px;">
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  <td style="font:500 11px/1 ${sans};letter-spacing:3px;text-transform:uppercase;color:${t.ink};">${esc(a.teacher)}</td>
  <td align="right" style="font:400 11px/1 ${sans};letter-spacing:3px;text-transform:uppercase;color:${t.muted};">English lessons</td>
 </tr></table>
</td></tr>

<tr><td class="px" style="background:${t.accent};padding:52px 48px 46px;">
 <p style="margin:0 0 22px;font:500 11px/1 ${sans};letter-spacing:3px;text-transform:uppercase;color:${t.onAccent};opacity:.8;">${eyebrow}</p>
 <h1 class="title" style="margin:0;font:italic 400 52px/1 ${serif};color:${t.onAccent};letter-spacing:-1px;">${esc(a.lesson.title)}</h1>
 ${a.lesson.topic ? `<p style="margin:18px 0 0;font:300 16px/1.6 ${sans};color:${t.onAccent};opacity:.9;">${esc(a.lesson.topic)}</p>` : ""}
 ${meta ? `<p style="margin:28px 0 0;padding-top:18px;border-top:1px solid ${t.onAccent}33;font:400 12px/1 ${sans};letter-spacing:2px;text-transform:uppercase;color:${t.onAccent};opacity:.85;">${meta}</p>` : ""}
</td></tr>

<tr><td class="px" style="background:${t.card};padding:44px 48px 40px;">
 <p style="margin:0 0 6px;font:italic 400 28px/1.2 ${serif};color:${t.ink};">${first ? `Hi ${esc(first)},` : "Hi there,"}</p>
 <p style="margin:0;font:300 16px/1.7 ${sans};color:${t.ink};">${lead}</p>
 ${note ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;"><tr>
  <td style="background:${t.soft};border-left:3px solid ${t.accent};padding:20px 24px;">
   <p style="margin:0;font:italic 400 18px/1.55 ${serif};color:${t.ink};">${esc(note).replace(/\n/g, "<br>")}</p>
   <p style="margin:12px 0 0;font:400 12px/1 ${sans};letter-spacing:2px;text-transform:uppercase;color:${t.muted};">— ${esc(a.teacher)}</p>
  </td></tr></table>` : ""}
 ${due ? `<p style="margin:28px 0 0;font:300 16px/1.6 ${sans};color:${t.ink};">Please finish it by <b style="font-weight:600;">${esc(due)}</b>.</p>` : ""}
 ${a.files?.length ? `<p style="margin:28px 0 8px;font:400 11px/1 ${sans};letter-spacing:2px;text-transform:uppercase;color:${t.muted};">Attached to this email</p>
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${a.files
   .map((f) => `<tr><td style="padding:10px 0;border-top:1px solid ${t.soft};font:400 15px/1.4 ${sans};color:${t.ink};"><span style="color:${t.accent};">&#9632;</span>&nbsp;&nbsp;${esc(f)}</td></tr>`)
   .join("")}</table>` : ""}
 <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:34px 0 0;"><tr>
  <td style="background:${t.accent};border-radius:999px;">
   <a href="${esc(a.url)}" target="_blank" style="display:inline-block;padding:16px 34px;font:500 15px/1 ${sans};letter-spacing:.5px;color:${t.onAccent};text-decoration:none;border-radius:999px;">Open the lesson &rarr;</a>
  </td></tr></table>
 <p style="margin:26px 0 0;font:300 13px/1.65 ${sans};color:${t.muted};">To open it, enter <b style="font-weight:500;color:${t.ink};">${esc(a.studentEmail)}</b> on the site. We will send you a short code to this address.</p>
</td></tr>

<tr><td class="px" style="background:${t.card};padding:0 48px 44px;">
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ${t.soft};padding-top:28px;">
  <p style="margin:0;font:300 14px/1.5 ${sans};color:${t.muted};">See you in class,</p>
  <p style="margin:6px 0 0;font:italic 400 26px/1.2 ${serif};color:${t.ink};">${esc(a.teacher)}</p>
  <p style="margin:4px 0 0;font:400 11px/1.4 ${sans};letter-spacing:2px;text-transform:uppercase;color:${t.muted};">Your English teacher</p>
 </td></tr></table>
</td></tr>

<tr><td class="px" style="padding:24px 8px 0;font:300 12px/1.6 ${sans};color:${t.muted};" align="center">
 If the button does not work, copy this link:<br><a href="${esc(a.url)}" style="color:${t.muted};word-break:break-all;">${esc(a.url)}</a>
</td></tr>

</table>
</td></tr></table>
</body></html>`
}

export function assignmentText(a: Assignment) {
  const due = formatDue(a.due)
  return [
    a.studentName ? `Hi ${a.studentName.trim().split(/\s+/)[0]},` : "Hi there,",
    "",
    a.kind === "homework" ? `Your teacher ${a.teacher} has assigned you homework:` : `Your teacher ${a.teacher} has shared a lesson with you:`,
    `${a.lesson.title}${a.lesson.topic ? ` — ${a.lesson.topic}` : ""}`,
    ...(a.note?.trim() ? ["", a.note.trim()] : []),
    ...(due ? ["", `Please finish it by ${due}.`] : []),
    ...(a.files?.length ? ["", `Attached: ${a.files.join(", ")}`] : []),
    "",
    `Open the lesson: ${a.url}`,
    `On the site, enter ${a.studentEmail} and we will send you a code.`,
    "",
    a.teacher,
  ].join("\n")
}

export type Request_ = {
  teacher: string
  name: string
  email: string
  what: string
  level?: string
  times?: string
  message?: string
  siteUrl: string
}

const T = DEFAULT_THEME
const SERIF = `Georgia,'Times New Roman',serif`
const SANS = `'Helvetica Neue',Helvetica,Arial,sans-serif`

function rows(r: Request_) {
  const items: [string, string | undefined][] = [
    ["Request", r.what],
    ["Level", r.level],
    ["Free time", r.times],
    ["Message", r.message],
  ]
  return items
    .filter(([, v]) => v && v.trim())
    .map(
      ([k, v]) => `<tr><td style="padding:14px 0;border-top:1px solid ${T.soft};vertical-align:top;width:120px;font:400 11px/1.6 ${SANS};letter-spacing:2px;text-transform:uppercase;color:${T.muted};">${esc(k)}</td>
<td style="padding:14px 0;border-top:1px solid ${T.soft};font:300 15px/1.6 ${SANS};color:${T.ink};">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")
}

function shell(r: Request_, eyebrow: string, title: string, body: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><style>@media (max-width:620px){.wrap{width:100%!important}.px{padding-left:24px!important;padding-right:24px!important}}</style></head>
<body style="margin:0;padding:0;background:${T.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${T.bg};"><tr><td align="center" style="padding:32px 12px 40px;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
<tr><td class="px" style="padding:0 8px 18px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
 <td style="font:500 11px/1 ${SANS};letter-spacing:3px;text-transform:uppercase;color:${T.ink};">${esc(r.teacher)}</td>
 <td align="right" style="font:400 11px/1 ${SANS};letter-spacing:3px;text-transform:uppercase;color:${T.muted};">English lessons</td></tr></table></td></tr>
<tr><td class="px" style="background:${T.accent};padding:44px 48px 40px;">
 <p style="margin:0 0 18px;font:500 11px/1 ${SANS};letter-spacing:3px;text-transform:uppercase;color:${T.onAccent};opacity:.8;">${esc(eyebrow)}</p>
 <h1 style="margin:0;font:italic 400 44px/1.05 ${SERIF};color:${T.onAccent};">${esc(title)}</h1></td></tr>
<tr><td class="px" style="background:${T.card};padding:40px 48px 44px;">${body}</td></tr>
<tr><td class="px" style="padding:24px 8px 0;font:300 12px/1.6 ${SANS};color:${T.muted};" align="center"><a href="${esc(r.siteUrl)}" style="color:${T.muted};">${esc(r.siteUrl.replace(/^https?:\/\//, ""))}</a></td></tr>
</table></td></tr></table></body></html>`
}

// To the teacher: a new request, reply goes straight to the student.
export function requestTeacherHtml(r: Request_) {
  return shell(
    r,
    "New request",
    r.name,
    `<p style="margin:0 0 24px;font:300 16px/1.6 ${SANS};color:${T.ink};"><a href="mailto:${esc(r.email)}" style="color:${T.accent};">${esc(r.email)}</a></p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows(r)}</table>
<p style="margin:26px 0 0;font:300 13px/1.6 ${SANS};color:${T.muted};">Press Reply to answer ${esc(r.name)} directly.</p>`,
  )
}

// To the student: a confirmation with a copy of what they sent.
export function requestStudentHtml(r: Request_) {
  const first = r.name.trim().split(/\s+/)[0]
  return shell(
    r,
    "Request received",
    `Thank you, ${first}!`,
    `<p style="margin:0;font:300 16px/1.7 ${SANS};color:${T.ink};">I have your message and will reply within a day to find a time that works for you.</p>
<p style="margin:26px 0 8px;font:400 11px/1 ${SANS};letter-spacing:2px;text-transform:uppercase;color:${T.muted};">What you sent</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows(r)}</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;"><tr><td style="border-top:1px solid ${T.soft};padding-top:26px;">
 <p style="margin:0;font:300 14px/1.5 ${SANS};color:${T.muted};">Talk soon,</p>
 <p style="margin:6px 0 0;font:italic 400 26px/1.2 ${SERIF};color:${T.ink};">${esc(r.teacher)}</p>
 <p style="margin:4px 0 0;font:400 11px/1.4 ${SANS};letter-spacing:2px;text-transform:uppercase;color:${T.muted};">English teacher</p></td></tr></table>`,
  )
}

export function requestText(r: Request_) {
  return [`${r.name} <${r.email}>`, "", `Request: ${r.what}`, r.level && `Level: ${r.level}`, r.times && `Free time: ${r.times}`, r.message && `\n${r.message}`]
    .filter(Boolean)
    .join("\n")
}
