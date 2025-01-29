export function generateSlug(name: string, userId?: string): string {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters except whitespace and hyphens
    .replace(/\s+/g, ''); // Remove all whitespace

  // Add user-specific prefix if userId is provided
  return userId ? `${userId.slice(0, 8)}-${baseSlug}` : baseSlug;
} 