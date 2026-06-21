import api from "../api/api";

export const getCustomers = ()=>{
    return api.get("/customers")
}