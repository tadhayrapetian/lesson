import type { Config } from "@netlify/functions"
import { isTeacher, json, listStudents, sessionFrom } from "../lib.mts"

export default async (req: Request) => {
  const session = sessionFrom(req)
  if (!session || !isTeacher(session.email)) return json({ error: "unauthorized" }, 401)
  return json({ students: await listStudents() })
}

export const config: Config = { path: "/api/students", method: "GET" }
