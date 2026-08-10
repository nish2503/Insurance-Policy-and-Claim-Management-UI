import api from "./axios";

export const getPolicies = (params) => {
  return api.get("/policies", {
    params,
  });
};

export const getPoliciesByStatus = (status, params) => {
  return api.get(`/policies/status/${status}`, {
    params,
  });
};

// Backend expects the query param name "policyNumber" (partial match),
// not a generic "keyword" — see PolicyController#searchPolicies.
export const searchPolicies = (policyNumber, params) => {
  return api.get("/policies/search", {
    params: {
      policyNumber,
      ...params,
    },
  });
};

export const cancelPolicy = (policyId) => {
  return api.patch(`/policies/${policyId}/cancel`);
};