import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
    try {
        const rows = await query("SELECT * FROM projects ORDER BY display_order ASC")
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, image_data, is_featured } = await request.json()
        if (!title || !description)
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
        const [maxRow] = await query("SELECT COALESCE(MAX(display_order), -1) as max FROM projects")
        const [row] = await query(
            "INSERT INTO projects (title, description, image_data, is_featured, display_order) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [title, description, image_data || null, is_featured ?? false, (maxRow?.max ?? -1) + 1],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
