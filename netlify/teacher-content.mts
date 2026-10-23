import { parse } from "node-html-parser"

// Lessons carry notes and answers for the teacher. Students get the lesson without them,
// removed here on the server, so they are not in the page at all. Lessons whose answers live
// inside their scripts (Small joys) still get the teacher buttons hidden.
const HIDE_FOR_STUDENTS = `<style>#tview,#tmodal,#teachBtn,#key-toggle,#key{display:none!important}</style>
<script>(()=>{const off=()=>{const b=document.body;if(b&&b.classList.contains('teacher'))b.classList.remove('teacher')};document.addEventListener('DOMContentLoaded',()=>{off();new MutationObserver(off).observe(document.body,{attributes:true,attributeFilter:['class']})})})()</script>`

export function forStudent(html: string) {
  if (!/\bt-only\b|class="ans"|id="key"|id="teachBtn"/.test(html)) return html
  const root = parse(html, { comment: true })
  for (const el of root.querySelectorAll(".t-only, span.ans")) el.remove()
  for (const el of root.querySelectorAll(".seg button.ok")) el.classList.remove("ok")
  const key = root.querySelector("#key")
  if (key) key.set_content("")
  return root.toString().replace("</head>", `${HIDE_FOR_STUDENTS}</head>`)
}

// The lessons' own "teacher code" is the same easy word in every file; the teacher is already
// logged in on the site, so Teacher view opens straight away.
export const forTeacher = (html: string) => html.replace(/TEACHER_CODE\s*=\s*"[^"]*"/, 'TEACHER_CODE = ""')
