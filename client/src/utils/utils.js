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

// Function to format a date for input (e.g., "YYYY-MM-DD")
// This function takes an ISO date string and formats it to "YYYY-MM-DD" format
export const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
};

// Function to format date for display
export const formatInputToISO = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date)) return null;
  return date.toISOString();
};

// Utility to get nested values from form data
export const getNestedValue = (obj, path) => {
  return path.split(".").reduce((prev, key) => prev?.[key], obj);
};

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

// Generate a range of date for calendar
export const getDateRangeForView = (view, dateStr) => {
  const currentDate = new Date(dateStr);

  switch (view) {
    case "Weekly": {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
      });
    }
    case "Monthly": {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return Array.from(
        { length: daysInMonth },
        (_, i) => new Date(year, month, i + 1)
      );
    }
    default:
      return [currentDate];
  }
};

export const isFutureDate = (day) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Date(day) > tomorrow;
};
