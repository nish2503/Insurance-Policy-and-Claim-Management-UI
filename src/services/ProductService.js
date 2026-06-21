import api from "../api/api";

export const getProducts = ()=>{
    return api.get("/products")
}