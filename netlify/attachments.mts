import { uploadStore } from "./lib.mts"

// Gmail accepts messages up to 25 MB; attachments grow by about a third when encoded.
const MAX_FILES_BYTES = 18 * 1024 * 1024

export type FileRef = { id: string; name: string; type: string; size: number; parts: number }

export function fileRefs(raw: unknown): FileRef[] | null {
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

// Also checks the real size: the sizes in the request are only what the page claims.
export async function loadFiles(files: FileRef[]) {
  const out = []
  let total = 0
  for (const f of files) {
    const file = await loadFile(f)
    if (!file) return null
    total += file.content.length
    if (total > MAX_FILES_BYTES) return null
    out.push(file)
  }
  return out
}

export const deleteFiles = (files: FileRef[]) =>
  Promise.all(files.flatMap((f) => Array.from({ length: f.parts }, (_, i) => uploadStore().delete(`${f.id}/${i}`))))
