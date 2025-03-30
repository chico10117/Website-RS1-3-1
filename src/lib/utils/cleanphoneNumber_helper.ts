export function cleanPhoneNumber(phone: number | null | undefined): number | null {
  if (phone === null || phone === undefined) return null;
  
  // Convert to string, remove all spaces and non-digit characters
  const cleaned = phone.toString().replace(/\s+/g, '').replace(/\D/g, '');
  
  // Convert back to number if we have digits
  if (cleaned.length > 0) {
    const numericValue = Number(cleaned);
    if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
      return numericValue;
    }
  }
  return null;
} 