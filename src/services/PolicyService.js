import api from "../api/api";

export const getPolicies = ()=>{
    return api.get("/policies")
}