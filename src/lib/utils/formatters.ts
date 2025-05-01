/**
 * Formats a price string or number into a string with two decimal places.
 * Returns '0.00' if the input is invalid.
 * @param price The price value (string or number).
 * @returns The formatted price string.
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) {
    return '0.00';
  }
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
} 