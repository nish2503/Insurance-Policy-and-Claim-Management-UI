import api from "./axios";

// ===========================
// ADMIN - CUSTOMERS
// ===========================

export const getCustomers = (params) => {
  return api.get("/customers", {
    params,
  });
};

export const searchCustomers = (keyword, params) => {
  return api.get("/customers/search", {
    params: {
      keyword,
      ...params,
    },
  });
};

export const getCustomersByStatus = (status, params) => {
  return api.get(`/customers/status/${status}`, {
    params,
  });
};

export const getCustomerById = (customerId) => {
  return api.get(`/customers/${customerId}`);
};

// ===========================
// CUSTOMER
// ===========================

export const getMyClaims = (params) => {
  return api.get("/claims/my", {
    params,
  });
};

export const getMyPolicies = (params) => {
  return api.get("/policies/my", {
    params,
  });
};

// Customer-facing product browsing must only ever surface active products.
// Deactivating a product in Admin should make it disappear from Browse
// Products (and, transitively, the purchase flow) immediately — hitting the
// unfiltered /products endpoint here would leak inactive products to
// customers, since that endpoint returns every product regardless of status.
export const getProducts = (params) => {
  return api.get("/products/status/true", { params });
};

// Same reasoning as getProducts above: customers should only ever see plans
// belonging to active products/plans, never deactivated ones.
export const getPlans = (params) => {
  return api.get("/plans", { params: { ...params, status: true } });
};

export const getMyPremiumPayments = (params) => {
  return api.get("/premium-payments/my", {
    params,
  });
};

export const getMyProfile = () => {
  return api.get("/customers/me");
};

export const createCustomerProfile = (data) => {
  return api.post("/customers/profile", data);
};

export const getPlansByProduct = (productId, params) => {
  return api.get(`/plans/product/${productId}`, { params: { ...params, status: true } });
};

export const purchasePolicy = (data) => {
  return api.post("/policies/purchase", data);
};

export const getPlanById = (planId) => {
  return api.get(`/plans/${planId}`);
};

export const getPremiumQuote = (planId, data) => {
  return api.post(`/plans/${planId}/quote`, data);
};

export const payPremium = (data) => {
  return api.post("/premium-payments", data);
};

export const raiseClaim = (data) => {
  return api.post("/claims", data);
};

export const uploadClaimDocument = (file) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post("/files/upload", formData);
};

// export const updateCustomerProfile = (customerId,data)=>{
//     return api.put(`/customers/${customerId}`,data);
// };
export const updateCustomerProfile = (data) => {
  return api.put("/customers/profile", data);
};

export const sendEmailOtp = (email) => {
  return api.post("/otp/email/send", { email });
};

export const verifyEmailOtp = (email, otp) => {
  return api.post("/otp/email/verify", { email, otp });
};
export const profileExists = () => {
  return api.get("/customers/profile/exists");
};