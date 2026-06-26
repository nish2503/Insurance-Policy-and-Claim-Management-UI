import api from "./axios";


export const getCustomers = ()=>{

    return api.get("/customers");

};



export const getMyClaims = (params)=>{

return api.get(
"/claims/my",
{
params
}
);

};


export const getMyPolicies = (params)=>{

return api.get(
"/policies/my",
{
params
}
);

};



export const getProducts = ()=>{

    return api.get("/products");

};



export const getPlans = ()=>{

    return api.get("/plans");

};



export const getMyPremiumPayments = (params)=>{

return api.get(
"/premium-payments/my",
{
params
}
);

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

export const uploadClaimDocument=(file)=>{


const formData = new FormData();


formData.append(
"file",
file
);



return api.post(

"/files/upload",

formData

);


};