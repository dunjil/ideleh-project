import { Pool } from "pg"

// Create a connection pool using the DATABASE_URL environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
})

/**
 * Execute a SQL query and return the rows.
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await pool.connect()
    try {
        const result = await client.query(text, params)
        return result.rows as T[]
    } finally {
        client.release()
    }
}

/**
 * Execute a SQL query and return a single row (or null).
 */
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const rows = await query<T>(text, params)
    return rows[0] ?? null
}

export default pool
