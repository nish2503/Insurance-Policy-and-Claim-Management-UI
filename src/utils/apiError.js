// The backend returns two different error response shapes:
//
// 1. DuplicateResourceException / AuthenticationException / etc:
//    { message: "Email already exists: ..." }
//
// 2. @Valid DTO field validation failures (MethodArgumentNotValidException):
//    { validationErrors: { mobileNumber: "Invalid mobile number", ... } }
//    (there is NO top-level "message" field in this case)
//
// This helper checks both shapes so the real backend message is always
// surfaced to the user instead of a generic fallback.

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (!data) return fallback;

  if (data.message) {
    return data.message;
  }

  if (data.validationErrors && typeof data.validationErrors === "object") {
    const firstMessage = Object.values(data.validationErrors)[0];
    if (firstMessage) return firstMessage;
  }

  return fallback;
}

/**
 * 🛠️ EXTENSION HELPER: Extracts the entire validation map to power inline field errors.
 * Usage: 
 *   catch (error) {
 *     setErrors(extractValidationErrors(error));
 *   }
 */
export function extractValidationErrors(error) {
  const data = error?.response?.data;
  if (!data) return {};

  // If it's a global error message, map it to a 'global' key block
  if (data.message) {
    const msg = data.message.toLowerCase();
    
    // Auto-map registration collisions onto their respective field identifiers
    if (msg.includes("email already exists") || msg.includes("email already registered")) {
      return { email: "This email address is already registered to an active profile." };
    }
    if (msg.includes("phone number already exists") || msg.includes("mobile number already exists")) {
      return { mobileNumber: "This mobile number is already registered to an active profile." };
    }
    
    return { global: data.message };
  }

  // If it's a field-level JSR validation map, return the sub-object dictionary flatly
  if (data.validationErrors && typeof data.validationErrors === "object") {
    return data.validationErrors;
  }

  return {};
}