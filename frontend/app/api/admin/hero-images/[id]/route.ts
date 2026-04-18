import { NextResponse } from "next/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api"

function strapiHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return extra
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const data: Record<string, unknown> = {}
        if (body.is_active !== undefined) data.is_active = body.is_active
        if (body.display_order !== undefined) data.display_order = body.display_order

        const res = await fetch(`${STRAPI_URL}/hero-images/${params.id}`, {
            method: "PUT",
            headers: strapiHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ data }),
        })
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error?.message || res.statusText)
        }
        const json = await res.json()
        return NextResponse.json(json.data)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const res = await fetch(`${STRAPI_URL}/hero-images/${params.id}`, {
            method: "DELETE",
            headers: strapiHeaders(),
        })
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error?.message || res.statusText)
        }
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
