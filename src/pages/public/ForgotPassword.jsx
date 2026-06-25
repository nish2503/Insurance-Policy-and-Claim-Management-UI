import {useState} from "react";
import {useNavigate,useParams,useLocation} from "react-router-dom";

import {
forgotPassword,
resetPassword
}
from "../../api/authApi";


function ForgotPassword(){


const {token:routeToken}=useParams();

const location=useLocation();


const queryToken =
new URLSearchParams(location.search)
.get("token");


const token =
routeToken || queryToken;



const [email,setEmail]=useState("");

const [newPassword,setNewPassword]=useState("");

const [confirmPassword,setConfirmPassword]=useState("");


const [showPassword,setShowPassword]=useState(false);

const [showConfirmPassword,setShowConfirmPassword]=useState(false);


const [loading,setLoading]=useState(false);



const navigate=useNavigate();



const hasToken =
Boolean(token);




async function sendLink(e){

e.preventDefault();


try{


setLoading(true);


await forgotPassword({

email

});


alert(
"Reset link sent"
);


}
catch(error){

alert(
error.response?.data?.message ||
"Failed"
);


}
finally{

setLoading(false);

}

}





async function reset(e){


e.preventDefault();



if(newPassword !== confirmPassword){

alert(
"Passwords do not match"
);

return;

}




if(newPassword.length < 8){

alert(
"Password must contain minimum 8 characters"
);

return;

}



try{


setLoading(true);


await resetPassword({

token,

newPassword

});


alert(
"Password changed successfully"
);


navigate("/login");


}
catch(error){


alert(
error.response?.data?.message ||
"Invalid reset link"
);


}
finally{

setLoading(false);

}


}





return(


<div className="container mt-5">


<div 
className="card p-4 mx-auto"
style={{maxWidth:"400px"}}
>


<h3 className="mb-4 text-center">

Forgot Password

</h3>




{

!hasToken ?


<form onSubmit={sendLink}>


<input

className="form-control mb-3"

type="email"

placeholder="Email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

required

/>



<button

className="btn btn-primary w-100"

disabled={loading}

>


{
loading ?
"Sending..." :
"Send Reset Link"
}


</button>


</form>



:


<form onSubmit={reset}>


<div className="input-group mb-3">


<input


className="form-control"


type={
showPassword
?
"text"
:
"password"
}


placeholder="New Password"


value={newPassword}


onChange={
e=>setNewPassword(e.target.value)
}


required


/>



<button

className="btn btn-outline-secondary"

type="button"

onClick={
()=>setShowPassword(!showPassword)
}

style={{
borderLeft:"none",
zIndex:5
}}

>


{

showPassword ?

<i className="bi bi-eye-slash-fill text-muted"></i>

:

<i className="bi bi-eye-fill text-muted"></i>


}


</button>



</div>






<div className="input-group mb-3">


<input


className="form-control"


type={
showConfirmPassword
?
"text"
:
"password"
}


placeholder="Confirm Password"


value={confirmPassword}


onChange={
e=>setConfirmPassword(e.target.value)
}


required


/>



<button

className="btn btn-outline-secondary"

type="button"

onClick={
()=>setShowConfirmPassword(!showConfirmPassword)
}

style={{
borderLeft:"none",
zIndex:5
}}

>


{

showConfirmPassword ?

<i className="bi bi-eye-slash-fill text-muted"></i>

:

<i className="bi bi-eye-fill text-muted"></i>


}


</button>


</div>





<button

className="btn btn-success w-100"

disabled={loading}

>


{

loading ?

"Updating..." :

"Reset Password"

}


</button>



</form>


}



</div>


</div>


)

}


export default ForgotPassword;