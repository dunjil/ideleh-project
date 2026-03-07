import { NextResponse } from "next/server"
import { signIn, SESSION_COOKIE } from "@/lib/auth-utils"

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        const { token, user } = await signIn(email, password)

        const response = NextResponse.json({ success: true, user })
        response.cookies.set(SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        })

        return response
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
    }
}
