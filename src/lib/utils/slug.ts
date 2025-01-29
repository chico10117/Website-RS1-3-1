export async function generateSlug(name: string): Promise<string> {
  try {
    const response = await fetch(`/api/slug?name=${encodeURIComponent(name)}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error generating slug:', error);
    throw error;
  }
} 