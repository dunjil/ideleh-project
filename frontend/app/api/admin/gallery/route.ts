import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
    try {
        const rows = await query("SELECT * FROM gallery ORDER BY created_at DESC")
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { title, image_data } = await request.json()
        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })
        const [row] = await query(
            "INSERT INTO gallery (title, image_data) VALUES ($1, $2) RETURNING *",
            [title, image_data || null],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
