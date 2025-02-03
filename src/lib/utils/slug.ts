export async function generateSlug(name: string, customFetch?: typeof fetch): Promise<string> {
    try {
        const fetchToUse = customFetch || fetch;
        const response = await fetchToUse('/api/slug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate slug');
        }

        const data = await response.json();
        return data.slug;
    } catch (error) {
        console.error('Error generating slug:', error);
        throw error;
    }
} 