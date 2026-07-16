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

export const validateAddress = (value, label = "Address") => {
  if (!value.trim()) return `${label} is required`;
  if (value.trim().length < 10)
    return `${label} must be at least 10 characters`;
  return "";
};

export const validateCity = (value, label = "City") => {
  if (!value.trim()) return `${label} is required`;
  if (!/^[A-Za-z ]+$/.test(value))
    return `${label} can contain only alphabets`;
  if (value.trim().length < 2)
    return `${label} must be at least 2 characters`;
  return "";
};

export const validateState = (value, label = "State") => {
  if (!value.trim()) return `${label} is required`;
  if (!/^[A-Za-z ]+$/.test(value))
    return `${label} can contain only alphabets`;
  if (value.trim().length < 2)
    return `${label} must be at least 2 characters`;
  return "";
};

export const validatePinCode = (value, label = "PIN Code") => {
  if (!value.trim()) return `${label} is required`;
  if (!/^\d{6}$/.test(value))
    return `${label} must contain exactly 6 digits`;
  return "";
};

export const validateName = (value, label = "Name") => {
  if (!value.trim()) return `${label} is required`;
  if (!/^[A-Za-z ]+$/.test(value))
    return `${label} can contain only alphabets`;
  if (value.trim().length < 3)
    return `${label} must be at least 3 characters`;
  return "";
};

export const validateRelation = (value) => {
  if (!value.trim()) return "Nominee relation is required";
  if (!/^[A-Za-z ]+$/.test(value))
    return "Relation can contain only alphabets";
  return "";
};