/**
 * Validate a URL string
 * @param value The URL to validate
 * @returns null if valid, error message if invalid
 */
export function validateUrl(value: string | null): string | null {
  // Allow null values (optional fields)
  if (value === null || value === '') {
    return null;
  }
  
  // Basic URL validation
  try {
    new URL(value);
    return null;
  } catch (e) {
    return 'Must be a valid URL (e.g., https://example.com)';
  }
}

/**
 * Validate a hex color code
 * @param value The color to validate
 * @returns null if valid, error message if invalid
 */
export function validateColor(value: string | null): string | null {
  // Allow null values or named colors
  if (value === null || value === '' || ['light', '1', '2', '3', '4'].includes(value)) {
    return null;
  }
  
  // Validate hex color
  if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
    return 'Must be a valid hex color (e.g., #FF5500)';
  }
  
  return null;
}

/**
 * Validate a phone number
 * @param value The phone number to validate
 * @returns null if valid, error message if invalid
 */
export function validatePhone(value: string | null): string | null {
  // Allow null values (optional fields)
  if (value === null || value === '') {
    return null;
  }
  
  // Basic phone number validation - adjust as needed for international formats
  if (!/^[\d\s\+\-\(\)\.]{7,20}$/.test(value)) {
    return 'Must be a valid phone number';
  }
  
  return null;
}

/**
 * Ensure a value is a string or null, not undefined
 * @param value The value to normalize
 * @returns A string, null, or empty string based on the input
 */
export function ensureStringOrNull(value: string | null | undefined): string | null {
  if (value === undefined) {
    return null;
  }
  
  if (value === '') {
    return null;
  }
  
  return value;
}

/**
 * Convert empty strings to null for database storage
 * @param value The value to process
 * @returns null for empty strings, otherwise the original value
 */
export function emptyStringToNull<T>(value: T): T | null {
  if (value === '') {
    return null;
  }
  return value;
}

/**
 * Normalize a URL string: ensure https:// prefix and convert empty to null
 * @param value The URL to normalize
 * @returns A normalized URL string or null
 */
export function normalizeUrl(value: string | null | undefined): string | null {
  // Handle null/undefined/empty
  if (!value || value.trim() === '') {
    return null;
  }
  
  // Add https:// if no protocol specified
  if (!/^https?:\/\//i.test(value)) {
    return `https://${value}`;
  }
  
  return value;
} 