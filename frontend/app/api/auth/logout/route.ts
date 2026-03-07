import { NextResponse } from "next/server"
import { signOut, SESSION_COOKIE } from "@/lib/auth-utils"
import { cookies } from "next/headers"

export async function POST() {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (token) {
        await signOut(token)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" })
    return response
}
