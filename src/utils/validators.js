// Shared, reusable field-level validators.
// Every function returns an error message string, or "" when the value is valid.
// Message format is kept consistent everywhere:
//   - Missing value:  "<Label> is required"
//   - Invalid value:  "<Label> must <specific rule>"

export function required(value, label = "This field") {
  if (value === undefined || value === null || String(value).trim() === "") {
    return `${label} is required`;
  }
  return "";
}

export function validateEmail(value, label = "Email") {
  const req = required(value, label);
  if (req) return req;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value.trim())) {
    return `${label} must be a valid email address`;
  }
  return "";
}

export function validateMobile(value, label = "Mobile number") {
  const req = required(value, label);
  if (req) return req;

  if (!/^\d{10}$/.test(value.trim())) {
    return `${label} must be exactly 10 digits`;
  }
  return "";
}

// Prepends the country code used for Twilio (E.164 format) once the
// raw 10-digit number has already passed validateMobile().
export function toE164India(mobileNumber) {
  return `+91${mobileNumber.trim()}`;
}

// Validates a date-of-birth value and enforces a minimum age (default 18).
// Accepts a value parseable by `new Date()`, e.g. an <input type="date"> value.
export function validateAge(value, label = "Date of birth", minAge = 18) {
  const req = required(value, label);
  if (req) return req;

  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) {
    return `${label} must be a valid date`;
  }

  if (dob > new Date()) {
    return `${label} cannot be in the future`;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < minAge) {
    return `${label} indicates age must be at least ${minAge} years`;
  }
  return "";
}

export function validateFullName(value, label = "Full name") {
  const req = required(value, label);
  if (req) return req;

  if (value.trim().length < 3) {
    return `${label} must be at least 3 characters`;
  }
  if (!/^[a-zA-Z\s.]+$/.test(value.trim())) {
    return `${label} must only contain letters and spaces`;
  }
  return "";
}

export function validatePassword(value, label = "Password") {
  const req = required(value, label);
  if (req) return req;

  if (value.length < 8) {
    return `${label} must be at least 8 characters long`;
  }
  if (!/[A-Z]/.test(value)) {
    return `${label} must contain at least one uppercase letter`;
  }
  if (!/[a-z]/.test(value)) {
    return `${label} must contain at least one lowercase letter`;
  }
  if (!/[0-9]/.test(value)) {
    return `${label} must contain at least one number`;
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(value)) {
    return `${label} must contain at least one special character`;
  }
  return "";
}

export function validateConfirmPassword(value, originalPassword, label = "Confirm password") {
  const req = required(value, label);
  if (req) return req;

  if (value !== originalPassword) {
    return `${label} must match the new password`;
  }
  return "";
}

export function validateOtp(value, label = "OTP") {
  const req = required(value, label);
  if (req) return req;

  if (!/^\d{6}$/.test(value.trim())) {
    return `${label} must be a 6 digit code`;
  }
  return "";
}

// CUS-BR / validation §17.2: Indian 6-digit PIN code.
export function validatePinCode(value, label = "PIN code") {
  const req = required(value, label);
  if (req) return req;

  if (!/^\d{6}$/.test(String(value).trim())) {
    return `${label} must be a valid 6 digit PIN code`;
  }
  return "";
}

// Generic "must be greater than zero" numeric check, shared by claim amount
// (CLM-BR-003), payment amount (PAYBR-002), coverage amount (PLN-BR-002), and
// premium amount (PLN-BR-003) instead of re-deriving it per form.
export function validatePositiveAmount(value, label = "Amount") {
  const req = required(value, label);
  if (req) return req;

  const num = Number(value);
  if (Number.isNaN(num)) {
    return `${label} must be a valid number`;
  }
  if (num <= 0) {
    return `${label} must be greater than zero`;
  }
  return "";
}

// Generic "cannot be a future date" check. Used for claim incident date
// (CLM-BR-005) and any other date field that must not be set ahead of today.
export function validateNotFutureDate(value, label = "Date") {
  const req = required(value, label);
  if (req) return req;

  const inputDate = new Date(value);
  if (Number.isNaN(inputDate.getTime())) {
    return `${label} must be a valid date`;
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (inputDate > today) {
    return `${label} cannot be a future date`;
  }
  return "";
}

// PAYBR-003: payment transaction reference. Kept permissive (alphanumeric +
// hyphen/underscore, 6-40 chars) since the exact gateway format is simulated.
export function validateTransactionReference(value, label = "Transaction reference") {
  const req = required(value, label);
  if (req) return req;

  if (!/^[A-Za-z0-9_-]{6,40}$/.test(value.trim())) {
    return `${label} must be 6-40 characters (letters, numbers, - or _ only)`;
  }
  return "";
}

// PLN-BR-004: coverage amount must be higher than premium amount. Designed to
// be used as a cross-field validator inside validateForm's validatorMap, e.g.
//   coverageAmount: (value, values) => validateCoverageAmount(value, values.premiumAmount)
export function validateCoverageAmount(value, premiumAmount, label = "Coverage amount") {
  const base = validatePositiveAmount(value, label);
  if (base) return base;

  if (premiumAmount && Number(value) <= Number(premiumAmount)) {
    return `${label} must be greater than the premium amount`;
  }
  return "";
}

export function validatePremiumAmount(value, coverageAmount, label = "Premium amount") {
  const base = validatePositiveAmount(value, label);
  if (base) return base;

  if (coverageAmount && Number(value) >= Number(coverageAmount)) {
    return `${label} must be less than the coverage amount`;
  }
  return "";
}

// Used for any "remarks" / justification free-text field (claim review
// recommendations, claim final decisions, etc.) so every such form shares one
// rule instead of re-deriving a minimum length locally.
export function validateRemarks(value, label = "Remarks", minLength = 15) {
  const req = required(value, label);
  if (req) return req;

  if (value.trim().length < minLength) {
    return `${label} must be at least ${minLength} characters`;
  }
  return "";
}

// Runs a map of { fieldName: validatorFn } against a form's values object.
// validatorMap[fieldName] is a function(value, formValues) -> errorString
// Returns { errors, isValid }
export function validateForm(values, validatorMap) {
  const errors = {};
  let isValid = true;

  Object.keys(validatorMap).forEach((field) => {
    const validatorFn = validatorMap[field];
    const message = validatorFn(values[field], values);
    if (message) {
      errors[field] = message;
      isValid = false;
    }
  });

  return { errors, isValid };
}