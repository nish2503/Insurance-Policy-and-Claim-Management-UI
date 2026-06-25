// import axios from "axios";


// const api = axios.create({

//     baseURL:"http://localhost:8080/api"

// });



// api.interceptors.request.use((config)=>{


//     const token = localStorage.getItem("token");


//     if(token){

//         config.headers.Authorization =
//         `Bearer ${token}`;

//     }


//     config.headers["Content-Type"] = "application/json";


//     return config;


// });




// // handle expired token

// api.interceptors.response.use(


// (response)=>{

//     return response;

// },


// (error)=>{


//     if(error.response?.status === 401){


//         localStorage.clear();


//         window.location.href="/login";


//     }


//     return Promise.reject(error);


// }



// );



// export default api;

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {
    // Check if the current request URL belongs to public auth endpoints
    const isAuthRoute = config.url.startsWith("/auth/");
    const token = localStorage.getItem("token");

    // Only attach bearer token if it's not a public authentication route
    if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";
    return config;
});

// Handle expired token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
