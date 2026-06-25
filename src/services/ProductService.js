import api from "../api/axios";

export const getProducts = ()=>{
    return api.get("/products")
}