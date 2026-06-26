import api from "./axios";


// Agent dashboard claims

export const getAgentClaims = (params)=>{

return api.get(
"/claims/agent",
{
params
}
);

};



// Review claim

export const reviewClaim = (claimId,data)=>{


    return api.put(

        `/claims/${claimId}/review`,

        data

    );


};




// Agent customers

export const getAgentCustomers = (params)=>{


    return api.get(

        "/customers",{
            params
        }

    );


};




// Issue policy

export const issuePolicy = (data)=>{


    return api.post(

        "/policies/issue",

        data

    );


};




// Agent policies

export const getAgentPolicies = (params)=>{


    return api.get(

        "/policies/agent",{
            params
        }

    );


};




// Agent payments

export const getAgentPayments = (params)=>{


    return api.get(

        "/premium-payments/agent",{
            params
        }

    );


};