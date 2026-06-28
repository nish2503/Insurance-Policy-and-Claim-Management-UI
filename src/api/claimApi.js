import api from "./axios";

export const getClaims = () => api.get("/claims");
