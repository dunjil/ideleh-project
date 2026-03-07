import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
    try {
        const rows = await query("SELECT * FROM site_content")
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const { key, title, content } = await request.json()
        if (!key || !content) return NextResponse.json({ error: "Key and content are required" }, { status: 400 })
        const [row] = await query(
            `INSERT INTO site_content (key, title, content, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (key) DO UPDATE SET title = $2, content = $3, updated_at = NOW()
       RETURNING *`,
            [key, title || null, content],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
