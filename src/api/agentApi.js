import axios from "./axios";


export const getAgentClaims = () => {
    return axios.get("/claims/agent");
};


export const reviewClaim = (claimId, data) => {

    return axios.put(
        `/claims/${claimId}/review`,
        data
    );

};