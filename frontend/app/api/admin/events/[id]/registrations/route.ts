import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'}/registrations?filters[event][$eq]=${params.id}`)
        const json = await response.json();
        return NextResponse.json(json.data || json)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const { first_name, last_name, gender, expectation, email, phone } = await request.json()
        if (!first_name || !last_name || !gender || !email || !phone)
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 })

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'}/registrations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    first_name,
                    last_name,
                    gender,
                    expectation: expectation || "",
                    email,
                    phone,
                    event: params.id
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            return NextResponse.json({ error: err?.error?.message || "Failed to submit" }, { status: response.status })
        }

        const json = await response.json();
        return NextResponse.json(json.data || json)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
