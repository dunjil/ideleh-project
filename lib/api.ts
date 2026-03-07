const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

async function fetcher(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`)
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
    }
    return response.json()
}

export const api = {
    events: {
        getAll: () => fetcher("/events/"),
        getOne: (id: string | number) => fetcher(`/events/${id}`),
    },
    projects: {
        getAll: () => fetcher("/projects/"),
    },
    team: {
        getAll: () => fetcher("/team/"),
    },
    gallery: {
        getAll: () => fetcher("/gallery/"),
    },
    content: {
        get: (key: string) => fetcher(`/content/${key}`),
    },
    hero: {
        getAll: () => fetcher("/hero-images/"),
    },
}
