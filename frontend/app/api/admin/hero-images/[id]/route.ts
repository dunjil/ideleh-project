import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const row = await query(
            `UPDATE hero_images SET
        is_active = COALESCE($1, is_active),
        display_order = COALESCE($2, display_order)
       WHERE id = $3 RETURNING *`,
            [body.is_active ?? null, body.display_order ?? null, params.id],
        )
        return NextResponse.json(row[0])
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await query("DELETE FROM hero_images WHERE id = $1", [params.id])
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
