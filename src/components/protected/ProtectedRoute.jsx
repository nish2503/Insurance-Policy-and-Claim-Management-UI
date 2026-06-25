import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";



function ProtectedRoute({children, allowedRole}) {


const {

isAuthenticated,

role

} = useAuth();




if(!isAuthenticated){


return (

<Navigate to="/login" />

);


}





if(

allowedRole &&

role !== allowedRole

){


return (

<Navigate to="/unauthorized" />

);


}





return children;


}



export default ProtectedRoute;