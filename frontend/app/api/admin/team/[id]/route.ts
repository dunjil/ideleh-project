import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const [row] = await query("SELECT * FROM team_members WHERE id = $1", [params.id])
        if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { name, position, bio, image_data } = await request.json()
        const [row] = await query(
            `UPDATE team_members SET
        name = COALESCE($1, name),
        position = COALESCE($2, position),
        bio = COALESCE($3, bio),
        image_data = CASE WHEN $4::text IS NOT NULL THEN $4 ELSE image_data END
       WHERE id = $5 RETURNING *`,
            [name, position, bio ?? null, image_data ?? null, params.id],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await query("DELETE FROM team_members WHERE id = $1", [params.id])
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
