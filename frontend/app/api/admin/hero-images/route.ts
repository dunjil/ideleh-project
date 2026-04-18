import { NextResponse } from "next/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api"

function strapiHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return extra
}

function mapHeroImage(item: any) {
    const baseUrl = STRAPI_URL.replace("/api", "")
    const imageUrl = item.image?.url
    return {
        id: item.documentId || item.id,
        title: item.title,
        description: item.description,
        is_active: item.is_active,
        display_order: item.display_order,
        image_data: imageUrl
            ? imageUrl.startsWith("http") ? imageUrl : baseUrl + imageUrl
            : null,
    }
}

export async function GET() {
    try {
        const res = await fetch(`${STRAPI_URL}/hero-images?populate=*&sort=display_order:asc`, {
            headers: strapiHeaders(),
            cache: "no-store",
        })
        if (!res.ok) throw new Error(res.statusText)
        const json = await res.json()
        return NextResponse.json((json.data || []).map(mapHeroImage))
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, image_data, is_active } = await request.json()
        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })

        // Get next display_order
        const listRes = await fetch(
            `${STRAPI_URL}/hero-images?fields=display_order&sort=display_order:desc&pagination[limit]=1`,
            { headers: strapiHeaders(), cache: "no-store" }
        )
        const listJson = await listRes.json()
        const maxOrder: number = listJson.data?.[0]?.display_order ?? -1
        const nextOrder = maxOrder + 1

        let imageId: number | null = null

        if (image_data) {
            const base64Data = image_data.replace(/^data:[^;]+;base64,/, "")
            const mimeMatch = image_data.match(/^data:([^;]+);/)
            const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg"
            const ext = mimeType.split("/")[1] || "jpg"
            const buffer = Buffer.from(base64Data, "base64")
            const blob = new Blob([buffer], { type: mimeType })

            const uploadForm = new FormData()
            uploadForm.append("files", blob, `hero-image-${Date.now()}.${ext}`)

            const uploadRes = await fetch(`${STRAPI_URL}/upload`, {
                method: "POST",
                headers: strapiHeaders(),
                body: uploadForm,
            })
            if (!uploadRes.ok) throw new Error(`Image upload failed: ${uploadRes.statusText}`)
            const uploaded = await uploadRes.json()
            imageId = uploaded[0]?.id ?? null
        }

        const createRes = await fetch(`${STRAPI_URL}/hero-images`, {
            method: "POST",
            headers: strapiHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({
                data: {
                    title,
                    description: description || null,
                    is_active: is_active ?? true,
                    display_order: nextOrder,
                    ...(imageId !== null ? { image: imageId } : {}),
                },
            }),
        })
        if (!createRes.ok) {
            const err = await createRes.json()
            throw new Error(err.error?.message || createRes.statusText)
        }
        const created = await createRes.json()
        return NextResponse.json(mapHeroImage(created.data))
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
