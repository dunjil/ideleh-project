import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const rows = await query(
            "SELECT * FROM registrations WHERE event_id = $1 ORDER BY created_at DESC",
            [params.id],
        )
        return NextResponse.json(rows)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const { first_name, last_name, gender, expectation, email, phone } = await request.json()
        if (!first_name || !last_name || !gender || !email || !phone)
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
        const [row] = await query(
            "INSERT INTO registrations (event_id, first_name, last_name, gender, expectation, email, phone) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
            [params.id, first_name, last_name, gender, expectation || null, email, phone],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
