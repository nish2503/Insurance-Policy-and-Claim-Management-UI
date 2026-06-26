import axios from "axios";


const api = axios.create({

    baseURL:"http://localhost:8080/api"

});



api.interceptors.request.use((config)=>{


    const isAuthRoute =
    config.url.startsWith("/auth/");


    const token =
    localStorage.getItem("token");



    if(token && !isAuthRoute){

        config.headers.Authorization =
        `Bearer ${token}`;

    }



    // Important fix:
    // Do not override multipart/form-data

    if(!(config.data instanceof FormData)){

        config.headers["Content-Type"] =
        "application/json";

    }



    return config;


});





api.interceptors.response.use(


(response)=>{


    return response;


},


(error)=>{


    if(error.response?.status===401){


        localStorage.clear();


        window.location.href="/login";


    }


    return Promise.reject(error);


}



);



export default api;