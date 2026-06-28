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

export const updateUserStatus = (userId, activeStatus) => {
  return api.patch(`/users/${userId}/status`, {
    activeStatus,
  });
};

export const createAgent = (data) => {
  return api.post("/users/agents", data);
};

export const updateUser = (userId, data) => {
  return api.put(`/users/${userId}`, data);
};
