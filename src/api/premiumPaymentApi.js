import axios from "./axios";


export const getMyPremiumPayments = ()=>{

    return axios.get(
        "/premium-payments/my"
    );

};