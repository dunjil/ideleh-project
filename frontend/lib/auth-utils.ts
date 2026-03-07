import { query, queryOne } from "./db"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const SESSION_COOKIE = "session_token"
const SESSION_DURATION_DAYS = 7

// ── Public user auth ──────────────────────────────────────────────────────────

export async function signUp(email: string, password: string) {
  const existing = await queryOne("SELECT id FROM users WHERE email = $1", [email])
  if (existing) throw new Error("An account with that email already exists")

  const password_hash = await bcrypt.hash(password, 12)
  const [user] = await query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, password_hash],
  )
  return user
}

export async function signIn(email: string, password: string) {
  const user = await queryOne<{ id: string; email: string; password_hash: string }>(
    "SELECT id, email, password_hash FROM users WHERE email = $1",
    [email],
  )
  if (!user) throw new Error("Invalid email or password")

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) throw new Error("Invalid email or password")

  // Create session
  const token = uuidv4()
  const expires = new Date(Date.now() + SESSION_DURATION_DAYS * 86400 * 1000)
  await query(
    "INSERT INTO user_sessions (token, user_id, expires_at) VALUES ($1, $2, $3)",
    [token, user.id, expires],
  )

  return { token, user: { id: user.id, email: user.email } }
}

export async function signOut(token: string) {
  await query("DELETE FROM user_sessions WHERE token = $1", [token])
}

export async function getSessionUser(token: string | undefined) {
  if (!token) return null
  const session = await queryOne<{ user_id: string; email: string; expires_at: Date }>(
    `SELECT s.user_id, u.email, s.expires_at
     FROM user_sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = $1`,
    [token],
  )
  if (!session) return null
  if (new Date(session.expires_at) < new Date()) {
    await query("DELETE FROM user_sessions WHERE token = $1", [token])
    return null
  }
  return { id: session.user_id, email: session.email }
}

// ── Server-Component helpers ──────────────────────────────────────────────────

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return getSessionUser(token)
}

export async function isAuthenticated() {
  return !!(await getCurrentUser())
}

export { SESSION_COOKIE }
