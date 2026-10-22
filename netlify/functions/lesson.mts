import type { Config, Context } from "@netlify/functions"
import { isStudent, json, readPrivate, readToken } from "../lib.mts"

// Added to every lesson: no right click, no save / print / view-source shortcuts, no copying.
const GUARD = `<style>@media print{html{display:none!important}}body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,[contenteditable]{-webkit-user-select:text;user-select:text}img{-webkit-user-drag:none}</style>
<script>(()=>{const stop=e=>{const t=e.target;if(t&&t.closest&&t.closest('input,textarea,[contenteditable]'))return;e.preventDefault()};
['contextmenu','copy','cut','dragstart','selectstart'].forEach(n=>document.addEventListener(n,stop,true));
document.addEventListener('keydown',e=>{const k=(e.key||'').toLowerCase(),m=e.ctrlKey||e.metaKey;
if(k==='f12'||(m&&['s','u','p'].includes(k))||(m&&e.shiftKey&&['i','j','c'].includes(k))){e.preventDefault();e.stopPropagation()}},true);})()</script>`

export default async (req: Request, context: Context) => {
  const auth = req.headers.get("authorization") ?? ""
  const session = readToken(auth.replace(/^Bearer\s+/i, ""))
  if (!session || !(await isStudent(session.email))) return json({ error: "unauthorized" }, 401)

  const slug = context.params.slug
  if (!/^[a-z0-9-]+$/.test(slug)) return json({ error: "not_found" }, 404)
  const html = await readPrivate(`lessons/${slug}.html`)
  if (html === null) return json({ error: "not_found" }, 404)

  const out = html.includes("</head>") ? html.replace("</head>", `${GUARD}</head>`) : GUARD + html
  return new Response(out, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  })
}

export const config: Config = { path: "/api/lesson/:slug", method: "GET" }
