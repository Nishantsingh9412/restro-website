/**
 * Converts a camelCase string to Sentence case.
 *
 * @param {string} text - The camelCase string to convert.
 * @returns {string} The converted Sentence case string.
 *
 * @example
 * // returns "Camel case string"
 * camelCaseToSentenceCase("camelCaseString");
 *
 * @example
 * // returns ""
 * camelCaseToSentenceCase("");
 *
 * @example
 * // returns "Hello world"
 * camelCaseToSentenceCase("helloWorld");
 */
export function camelCaseToSentenceCase(text) {
  if (!text) return ""; // Handle empty or undefined strings
  const result = text.replace(/([A-Z])/g, " $1"); // Add a space before uppercase letters
  return result.charAt(0).toUpperCase() + result.slice(1); // Capitalize the first letter
}

// Function to parse German currency format (e.g., "1.234,56 €")
export function parseGermanCurrency(input) {
  if (typeof input !== "string") input = String(input); // Convert to string if not already
  const cleaned = input
    .replace(/[^\d.,]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number;
}

// Function to format a number to German currency
export function formatToGermanCurrency(value) {
  if (value == null || value === "") return "0,00 €";
  if (typeof value !== "number") value = parseFloat(value); // Convert string to number if needed
  if (isNaN(value)) return "0,00 €"; // Handle invalid numbers
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

// Function to format the key for display
export const formatKey = (key) =>
  key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

// Function to format the value for display
export const formatValue = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        item?.name
          ? formatKey(item.name)
          : typeof item === "string"
          ? formatKey(item)
          : JSON.stringify(item)
      )
      .join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(
        ([subKey, subValue]) =>
          `${formatKey(subKey)}: ${parseFloat(subValue || 0).toFixed(3)}`
      )
      .join(", ");
  }

  if (typeof value === "string") {
    return formatKey(value);
  }

  return String(value);
};
