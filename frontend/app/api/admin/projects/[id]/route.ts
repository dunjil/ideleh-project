import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const [row] = await query("SELECT * FROM projects WHERE id = $1", [params.id])
        if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { title, description, image_data, is_featured } = await request.json()
        const [row] = await query(
            `UPDATE projects SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        image_data = CASE WHEN $3::text IS NOT NULL THEN $3 ELSE image_data END,
        is_featured = COALESCE($4, is_featured)
       WHERE id = $5 RETURNING *`,
            [title, description, image_data ?? null, is_featured ?? null, params.id],
        )
        return NextResponse.json(row)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await query("DELETE FROM projects WHERE id = $1", [params.id])
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
