import api from "./axios";

// Legacy — kept for any existing callers.
export const getClaims = () => api.get("/claims");

// Admin: claims that have moved past initial internal-staff review and are
// ready for a final approve/reject decision. Excludes SUBMITTED claims that
// haven't been picked up by internal staff yet (CLC-RUL-004 / SRS §7.1 —
// admin authority is the final decision only, so un-reviewed claims are
// deliberately kept out of admin's queue).
export const getClaimsPendingAdminDecision = (params) => {
  return api.get("/claims/pending-decision", { params });
};

// Full claim detail — the response already embeds documents, status
// history, coverage totals, and the past-claims timeline (see
// ClaimResponseDTO on the backend), so one call is enough to populate the
// claim detail / approval panel.
export const getClaimById = (claimId) => {
  return api.get(`/claims/${claimId}`);
};

export const getClaimHistory = (claimId, params) => {
  return api.get(`/claim-history/claim/${claimId}`, { params });
};

export const viewClaimDocument = (documentId) => {
  return api.get(`/claims/documents/${documentId}`);
};

// Admin final decision — approve or reject a claim (CLM-BR-008 / CLC-RUL-004).
// Backend rejects this once a claim is already APPROVED/REJECTED (CLM-BR-009).
export const processClaimDecision = (claimId, data) => {
  return api.put(`/claims/${claimId}/decision`, data);
};

export const getClaimsByStatus = (status, params) => {
  return api.get(`/claims/status/${status}`, { params });
};

export const searchClaimsByNumber = (claimNumber, params) => {
  return api.get("/claims/search", { params: { claimNumber, ...params } });
};