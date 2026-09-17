import axios from "./axios";

export const getMyPremiumPayments = () => {
  return axios.get("/premium-payments/my");
};

export const getPaymentsByStatus = (status, params) => {
  return axios.get(`/premium-payments/status/${status}`, {
    params,
  });
};

// Backend expects the query param name "reference" (partial match against
// transactionReference), not a generic "keyword" — see
// PremiumPaymentController#searchPayments.
export const searchPayments = (reference, params) => {
  return axios.get("/premium-payments/search", {
    params: {
      reference,
      ...params,
    },
  });
};