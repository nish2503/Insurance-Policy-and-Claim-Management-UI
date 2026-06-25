import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { login } from "../../api/authApi";

import { loginSuccess } from "../../features/auth/authSlice";



function Login(){



const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const [loading,setLoading] = useState(false);



const navigate = useNavigate();

const dispatch = useDispatch();






const handleLogin = async(e)=>{


e.preventDefault();


try{


setLoading(true);



const response = await login({

email,

password

});



const data = response.data;





dispatch(

loginSuccess({

token:data.jwtToken,

role:data.userRole,

user:data

})

);







switch(data.userRole){


case "ADMIN":

navigate("/admin");

break;



case "AGENT":

navigate("/agent");

break;



case "CUSTOMER":

navigate("/customer");

break;



default:

alert("Invalid role");



}



}



catch(error){



alert(

error.response?.data?.message ||

"Login Failed"

);



}



finally{


setLoading(false);


}



};









return(


<div className="container mt-5">


<div

className="card p-4 mx-auto"

style={{maxWidth:"400px"}}

>


<h3>

Insurance Login

</h3>





<form onSubmit={handleLogin}>




<input


className="form-control mb-3"


placeholder="Email"


value={email}


onChange={

e=>setEmail(e.target.value)

}


/>







<input


className="form-control mb-3"


type="password"


placeholder="Password"


value={password}


onChange={

e=>setPassword(e.target.value)

}


/>








<button


className="btn btn-primary w-100"


disabled={loading}


>


{

loading

?

"Logging in..."

:

"Login"

}



</button>






</form>




</div>



</div>



);


}



export default Login;