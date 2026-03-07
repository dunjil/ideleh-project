import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await query("DELETE FROM gallery WHERE id = $1", [params.id])
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
