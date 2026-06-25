

import api from "./axios";


export const login = (data)=>{

    return api.post(
        "/auth/login",
        data
    );

};


export const register = (data)=>{

    return api.post(
        "/auth/register",
        data
    );

};

export const verifyRegister = (data)=>{

    return api.post(
        "/auth/verify-register",
        data
    );

};


export const resendOtp = (data)=>{

    return api.post(
        "/auth/resend-otp",
        data
    );

};

export const forgotPassword = (data)=>{

    return api.post(
        "/auth/forgot-password",
        data
    );

};



export const resetPassword = (data)=>{

    return api.post(
        "/auth/reset-password",
        data
    );

};