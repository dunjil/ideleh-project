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
    },
    projects: {
        getAll: () => fetcher("/projects?populate=*"),
    },
    team: {
        getAll: () => fetcher("/team-members?populate=*"),
    },
    gallery: {
        getAll: () => fetcher("/galleries?populate=*"),
    },
    content: {
        get: (key: string) => fetcher(`/site-contents?filters[key][$eq]=${key}&populate=*`, true),
    },
    hero: {
        getAll: () => fetcher("/hero-images?populate=*"),
    },
}
