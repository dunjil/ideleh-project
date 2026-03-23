const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api"

function mapStrapiImages(data: any): any {
    if (!data) return data;
    if (Array.isArray(data)) return data.map(mapStrapiImages);
    if (typeof data === 'object') {
        const result = { ...data };
        
        // Use documentId as the primary id for frontend components
        if (result.documentId) {
            result.id = result.documentId;
        }

        if (result.image && result.image.url) {
            const baseUrl = API_URL.replace('/api', '');
            result.image_data = result.image.url.startsWith('http') 
                ? result.image.url 
                : baseUrl + result.image.url;
        }
        return result;
    }
    return data;
}

async function fetcher(endpoint: string, single = false) {
    const response = await fetch(`${API_URL}${endpoint}`)
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
    }
    const json = await response.json()
    // Strapi wraps responses in "data" property
    if (json.data !== undefined) {
        let items = mapStrapiImages(json.data);
        if (single && Array.isArray(items)) {
            return items[0] || null
        }
        return items
    }
    return mapStrapiImages(json)
}

export const api = {
    events: {
        getAll: () => fetcher("/events?populate=*"),
        getOne: (id: string | number) => fetcher(`/events/${id}?populate=*`),
        create: (data: any) => fetch(`${API_URL}/events/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),
        update: (id: string | number, data: any) => fetch(`${API_URL}/events/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),
        delete: (id: string | number) => fetch(`${API_URL}/events/${id}`, { method: "DELETE" }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),
        getRegistrations: (id: string | number) => fetcher(`/events/${id}/registrations`),
        register: (id: string | number, data: any) => fetch(`${API_URL}/events/${id}/registrations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),
    },
    projects: {
        getAll: () => fetcher("/projects?populate=*"),
    },
    team: {
        getAll: () => fetcher("/team-members?populate=*"),
    },
    gallery: {
        getAll: () => fetcher("/galleries?populate=*"),
        create: (data: any) => fetch(`${API_URL}/gallery/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),
        delete: (id: string | number) => fetch(`${API_URL}/gallery/${id}`, { method: "DELETE" }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),
    },
    content: {
        get: (key: string) => fetcher(`/site-contents?filters[key][$eq]=${key}&populate=*`, true),
    },
    contacts: {
        getAll: () => fetcher("/contacts/"),
    },
    hero: {
        getAll: () => fetcher("/hero-images?populate=*"),
    },
}
