export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove all special characters except whitespace
    .replace(/\s+/g, ''); // Remove all whitespace
} 