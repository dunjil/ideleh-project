import { NextResponse } from "next/server"
import { signUp } from "@/lib/auth-utils"

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }
        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
        }

        const user = await signUp(email, password)
        return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Signup failed" }, { status: 400 })
    }
}
