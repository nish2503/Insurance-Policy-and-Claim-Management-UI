import axios from "./axios";


export function getCustomers(){

    return axios.get(
        "/customers"
    );

}


export const getMyClaims = ()=>{

    return axios.get(
        "/claims/my"
    );

};



export const getMyPolicies = ()=>{

    return axios.get(
        "/policies/my"
    );

};



export const getProducts = ()=>{

    return axios.get(
        "/products"
    );

};



export const getPlans = ()=>{

    return axios.get(
        "/plans"
    );

};



export const getMyPremiumPayments = ()=>{

    return axios.get(
        "/premium-payments/my"
    );

};