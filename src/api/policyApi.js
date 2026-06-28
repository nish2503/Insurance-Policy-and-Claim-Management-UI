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

export const cancelPolicy = (policyId) => {
  return api.patch(`/policies/${policyId}/cancel`);
};
