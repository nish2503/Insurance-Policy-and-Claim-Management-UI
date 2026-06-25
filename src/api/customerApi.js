import api from "./axios";


export const getCustomers = ()=>{

    return api.get("/customers");

};



export const getMyClaims = ()=>{

    return api.get("/claims/my");

};



export const getMyPolicies = ()=>{

    return api.get("/policies/my");

};



export const getProducts = ()=>{

    return api.get("/products");

};



export const getPlans = ()=>{

    return api.get("/plans");

};



export const getMyPremiumPayments = ()=>{

    return api.get("/premium-payments/my");

};

export const getMyProfile = ()=>{

    return api.get("/customers/me");

};


export const createCustomerProfile = (data)=>{

    return api.post(
        "/customers/profile",
        data
    );

};

export const getPlansByProduct=(productId)=>{

return api.get(
`/plans/product/${productId}`
);

};      

export const purchasePolicy=(data)=>{

return api.post(
"/policies/purchase",
data
);

}

export const payPremium = (data) =>
    api.post("/premium-payments", data);

export const raiseClaim = (data) =>
    api.post("/claims", data);