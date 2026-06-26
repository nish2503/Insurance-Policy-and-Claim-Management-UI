import api from "./axios";

// Agent dashboard claims

export const getAgentClaims = () => {
  return api.get("/claims/agent");
};

// Review claim

export const reviewClaim = (claimId, data) => {
  return api.put(
    `/claims/${claimId}/review`,

    data,
  );
};

// Agent customers

export const getAgentCustomers = () => {
  return api.get("/customers");
};

// Issue policy

export const issuePolicy = (data) => {
  return api.post(
    "/policies/issue",

    data,
  );
};

// Agent policies

export const getAgentPolicies = () => {
  return api.get("/policies/agent");
};

// Agent payments

export const getAgentPayments = () => {
  return api.get("/premium-payments/agent");
};
