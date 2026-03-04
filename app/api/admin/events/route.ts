import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
    try {
        const rows = await query("SELECT * FROM events ORDER BY event_date DESC")
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, event_date, image_data } = await request.json()
        if (!title || !description || !event_date)
            return NextResponse.json({ error: "Title, description and event_date are required" }, { status: 400 })
        const [row] = await query(
            "INSERT INTO events (title, description, event_date, image_data) VALUES ($1,$2,$3,$4) RETURNING *",
            [title, description, event_date, image_data || null],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
