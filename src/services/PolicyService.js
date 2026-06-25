import api from "../api/axios";

export const getPolicies = ()=>{
    return api.get("/policies")
}