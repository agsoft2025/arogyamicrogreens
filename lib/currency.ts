/**
 * Centralized currency formatting utility — Indian Rupee (INR / ₹)
 * Uses the en-IN locale with Indian numbering system.
 *
 * Indian number format:
 *   ₹1,000       (thousands)
 *   ₹10,000
 *   ₹1,00,000    (lakhs)
 *   ₹10,00,000
 *   ₹1,00,00,000 (crores)
 */

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const INR_FORMATTER_NO_DECIMAL = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const INR_NUMBER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

/**
 * Format a number as Indian Rupee with up to 2 decimal places.
 * e.g. formatCurrency(125000)  →  "₹1,25,000.00"
 * e.g. formatCurrency(1249)    →  "₹1,249.00"
 */
export function formatCurrency(amount: number): string {
  return INR_FORMATTER.format(amount);
}

/**
 * Format a number as Indian Rupee with no decimal places.
 * e.g. formatCurrencyInt(125000)  →  "₹1,25,000"
 * e.g. formatCurrencyInt(1249)    →  "₹1,249"
 */
export function formatCurrencyInt(amount: number): string {
  return INR_FORMATTER_NO_DECIMAL.format(amount);
}

/**
 * Format just the number portion (no ₹ symbol) in Indian numbering.
 * Useful where the ₹ is already displayed elsewhere.
 */
export function formatNumber(amount: number): string {
  return INR_NUMBER_FORMATTER.format(amount);
}

/**
 * Parse a currency string back to a number.
 * Handles ₹, commas, and whitespace.
 * e.g. parseCurrency("₹1,25,000.00") → 125000
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[₹\s,]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse an INR-formatted price string (for sort comparisons).
 * Handles ₹ prefix and Indian comma separators.
 */
export function parsePriceString(value: string): number {
  return parseCurrency(value);
}
