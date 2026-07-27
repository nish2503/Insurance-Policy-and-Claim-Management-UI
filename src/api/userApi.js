import api from "./axios";

// ===========================
// USERS
// ===========================

export const getUsers = (params) => {
  return api.get("/users", {
    params,
  });
};

export const getUserById = (userId) => {
  return api.get(`/users/${userId}`);
};

export const getUsersByRole = (role, params) => {
  return api.get(`/users/role/${role}`, {
    params,
  });
};

export const getUsersByStatus = (status, params) => {
  return api.get(`/users/status/${status}`, {
    params,
  });
};

export const updateUserStatus = (userId, activeStatus, remarks) => {
  return api.patch(`/users/${userId}/status`, {
    activeStatus,
    remarks,
  });
};

export const createInternalStaff = (data) => {
  return api.post("/users/internal-staff", data);
};

export const assignProductToUser = (userId, productId) => {
  return api.put(`/users/${userId}/assign-product`, { productId });
};

export const updateUser = (userId, data) => {
  return api.put(`/users/${userId}`, data);
};