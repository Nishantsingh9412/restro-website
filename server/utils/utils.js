// utils.js

// Function to handle errors
function handleError(error) {
  console.error("Error:", error.message || error);
  return {
    success: false,
    message: error.message || "An unknown error occurred",
  };
}

// Function to handle API calls
async function handleApiCall(apiFunction, ...args) {
  try {
    const response = await apiFunction(...args);
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }
    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return handleError(error);
  }
}

export default {
  handleError,
  handleApiCall,
};
