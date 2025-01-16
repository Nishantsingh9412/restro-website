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
