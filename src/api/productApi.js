import api from "./axios";

export const getProducts = (params) => {
  return api.get("/products", { params });
};

export const getProductById = (productId) => {
  return api.get(`/products/${productId}`);
};

export const getProductsByStatus = (activeStatus, params) => {
  return api.get(`/products/status/${activeStatus}`, { params });
};

export const createProduct = (data) => {
  return api.post("/products", data);
};

export const updateProduct = (productId, data) => {
  return api.put(`/products/${productId}`, data);
};

export const deactivateProduct = (productId) => {
  return api.patch(`/products/${productId}/deactivate`);
};

export const activateProduct = (productId) => {
  return api.patch(`/products/${productId}/activate`);
};
