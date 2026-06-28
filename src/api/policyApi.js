import api from "./axios";

export function getPolicies() {
  return api.get("/policies");
}
