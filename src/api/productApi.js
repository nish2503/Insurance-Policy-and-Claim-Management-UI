import api from "./axios";


export function getProducts(){

return api.get(
"/products"
);

}