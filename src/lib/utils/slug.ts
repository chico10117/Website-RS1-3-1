export async function generateSlug(name: string, customFetch?: typeof fetch): Promise<string> {
    try {
        const fetchToUse = customFetch || fetch;
        
        // The API endpoint handles duplicate slugs by adding a counter or random suffix
        // for different users to ensure global uniqueness
        const response = await fetchToUse('/api/slug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name }),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to generate slug: ${response.status}`);
        }

        const data = await response.json();
        return data.slug;
    } catch (error) {
        console.error('Error generating slug:', error);
        throw error;
    }
}

/**
 * Check if a slug is available or already in use
 * @param slug The slug to check
 * @param customFetch Optional custom fetch function
 * @returns Object with availability information
 */
export async function checkSlug(slug: string, customFetch?: typeof fetch): Promise<{
    exists: boolean;
    ownedByCurrentUser: boolean;
    ownedByOtherUser: boolean;
    available: boolean;
    slug: string;
}> {
    try {
        const fetchToUse = customFetch || fetch;
        
        const response = await fetchToUse(`/api/slug/check?slug=${encodeURIComponent(slug)}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to check slug: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error checking slug:', error);
        throw error;
    }
} 