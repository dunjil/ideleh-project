import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
    try {
        const rows = await query("SELECT * FROM team_members ORDER BY name ASC")
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { name, position, bio, image_data } = await request.json()
        if (!name || !position)
            return NextResponse.json({ error: "Name and position are required" }, { status: 400 })
        const [row] = await query(
            "INSERT INTO team_members (name, position, bio, image_data) VALUES ($1,$2,$3,$4) RETURNING *",
            [name, position, bio || null, image_data || null],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
