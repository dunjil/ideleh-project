import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
    try {
        const rows = await query("SELECT * FROM hero_images ORDER BY display_order ASC")
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, image_data, is_active } = await request.json()
        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })

        // Get max display_order
        const [maxRow] = await query("SELECT COALESCE(MAX(display_order), -1) as max FROM hero_images")
        const nextOrder = (maxRow?.max ?? -1) + 1

        const [row] = await query(
            `INSERT INTO hero_images (title, description, image_data, is_active, display_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, description || null, image_data || null, is_active ?? true, nextOrder],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
