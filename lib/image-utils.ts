/**
 * Convert a File object to a base64 data URI string.
 * This is used instead of uploading to Supabase Storage.
 * The resulting string (e.g. "data:image/jpeg;base64,...") is stored in the DB.
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Return the image src to use in <img> or Next.js <Image>.
 * If image_data is already a base64 data URI or an http(s) URL, return it as-is.
 * Otherwise return the placeholder.
 */
export function getImageSrc(imageData: string | null | undefined): string {
    if (!imageData) return "/placeholder.svg"
    if (
        imageData.startsWith("data:") ||
        imageData.startsWith("http://") ||
        imageData.startsWith("https://")
    ) {
        return imageData
    }
    return "/placeholder.svg"
}
