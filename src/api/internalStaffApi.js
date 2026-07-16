import api from "./axios";
// Internal staff dashboard claims
export const getInternalStaffClaims = (params) => {
  return api.get("/claims/internal-staff", { params });
};
// Review claim
export const reviewClaim = (claimId, data) => {
  return api.put(`/claims/${claimId}/review`, data);
};
// Internal staff customers
export const getInternalStaffCustomers = (params) => {
  return api.get("/customers", { params });
};
// Issue policy
export const issuePolicy = (data) => {
  return api.post("/policies/issue", data);
};
// Internal staff policies
export const getInternalStaffPolicies = (params) => {
  return api.get("/policies/internal-staff", { params });
};
// Internal staff payments

export const getInternalStaffPayments = (params) => {
  return api.get("/premium-payments/internal-staff", { params });
};
// Get plans for issue policy dropdown
export const getPlans = () => {
  return api.get("/plans");
};
export const getClaimHistory = (claimId) => {
  return api.get(`/claim-history/claim/${claimId}`);
};
export const getClaimDetails = (claimId) => {
  return api.get(`/claims/${claimId}`);
};
export const viewClaimDocument = (documentId)=>{

return api.get(
`/claims/documents/${documentId}`
);

};