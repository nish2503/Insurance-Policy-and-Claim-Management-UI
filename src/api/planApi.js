import api from "./axios";

export const getPlans = (params) => {
  return api.get("/plans", {
    params,
  });
};

export const getPlanById = (planId) => {
  return api.get(`/plans/${planId}`);
};

export const getPlansByProduct = (productId, params) => {
  return api.get(`/plans/product/${productId}`, {
    params,
  });
};

export const createPlan = (data) => {
  return api.post("/plans", data);
};

export const updatePlan = (planId, data) => {
  return api.put(`/plans/${planId}`, data);
};

export const deactivatePlan = (planId) => {
  return api.patch(`/plans/${planId}/deactivate`);
};

export const activatePlan = (planId) => {
  return api.patch(`/plans/${planId}/activate`);
};
