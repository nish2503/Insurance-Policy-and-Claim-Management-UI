import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
forgotPassword,
resetPassword
} from "../../api/authApi";



function ForgotPassword(){


const [email,setEmail]=useState("");

const [otp,setOtp]=useState("");

const [newPassword,setNewPassword]=useState("");

const [step,setStep]=useState(1);


const navigate = useNavigate();





const sendOtp = async()=>{


try{


await forgotPassword({

email

});


alert("OTP sent");


setStep(2);



}
catch(error){


alert(

error.response?.data?.message ||

"Failed to send OTP"

);


}


};







const changePassword = async(e)=>{


e.preventDefault();



try{


await resetPassword({

email,

otp,

newPassword


});



alert("Password changed successfully");


navigate("/login");



}
catch(error){


alert(

error.response?.data?.message ||

"Reset failed"

);


}



};







return(


<div className="container mt-5">


<div

className="card p-4 mx-auto"

style={{maxWidth:"400px"}}

>


<h3>

Forgot Password

</h3>





{

step===1 &&


<>


<input


className="form-control mb-3"


placeholder="Email"


value={email}


onChange={e=>setEmail(e.target.value)}


/>



<button

className="btn btn-primary w-100"

onClick={sendOtp}

>

Send OTP

</button>



</>


}






{

step===2 &&


<form onSubmit={changePassword}>


<input

className="form-control mb-3"

placeholder="OTP"

value={otp}

onChange={e=>setOtp(e.target.value)}

/>




<input

className="form-control mb-3"

type="password"

placeholder="New Password"

value={newPassword}

onChange={e=>setNewPassword(e.target.value)}

/>




<button

className="btn btn-success w-100"

>

Reset Password

</button>



</form>


}




</div>


</div>


);


}


export default ForgotPassword;