// Admin-form live-preview formula, mirrored from the backend
// PremiumCalculationService's rate/discount math. This is used ONLY for
// PlanFormModal's live "reference premium" preview — the admin is typing
// ratePerUnit/discount values themselves, so a client-side mirror of their
// own numbers is fine here.
//
// This must NEVER be used for the customer purchase flow — that always
// calls the real /api/plans/{planId}/quote endpoint (see PurchasePolicy.jsx
// and api/planApi.js:getPremiumQuote), since the backend is the only source
// of truth for what a customer actually gets charged.

export const PREMIUM_TYPES = ["MONTHLY", "QUARTERLY", "ANNUAL", "ONE_TIME"];

const FIFTY_THOUSAND = 50000;

// Returns a number (whole rupees) or null if inputs aren't ready yet.
// coverageAmount: coverage to price at (e.g. maxCoverageAmount for the
// plan-form reference preview).
// ratePerUnit: premium per ₹50,000 of coverage, per year.
// duration: plan term length in years (only used for ONE_TIME).
// annualDiscountPercent / oneTimeDiscountPercent: 0-100.
export function calculatePremium({
  coverageAmount,
  ratePerUnit,
  duration,
  premiumType,
  annualDiscountPercent = 0,
  oneTimeDiscountPercent = 0,
}) {
  const coverage = Number(coverageAmount);
  const rate = Number(ratePerUnit);
  const years = Number(duration);

  if (!coverage || coverage <= 0 || !rate || rate <= 0 || !years || years <= 0 || !premiumType) {
    return null;
  }

  const units = coverage / FIFTY_THOUSAND;
  const annualPremium = units * rate;

  let rawAmount;
  let discountPercent = 0;

  switch (premiumType) {
    case "MONTHLY":
      rawAmount = annualPremium / 12;
      break;
    case "QUARTERLY":
      rawAmount = annualPremium / 4;
      break;
    case "ONE_TIME":
      rawAmount = annualPremium * years;
      discountPercent = Number(oneTimeDiscountPercent) || 0;
      break;
    case "ANNUAL":
    default:
      rawAmount = annualPremium;
      discountPercent = Number(annualDiscountPercent) || 0;
  }

  const discountAmount = (rawAmount * discountPercent) / 100;
  const finalPremium = rawAmount - discountAmount;

  return Math.round(finalPremium);
}

export function isWholeNumber(value) {
  if (value === "" || value === null || value === undefined) return false;
  return Number.isInteger(Number(value));
}

export function isMultipleOf50000(value) {
  return Number(value) % FIFTY_THOUSAND === 0;
}