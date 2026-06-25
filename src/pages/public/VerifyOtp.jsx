import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    verifyRegister,
    resendOtp
} from "../../api/authApi";

import useOtpTimer from "../../hooks/useOtpTimer";


function VerifyOtp(){


const [email,setEmail]=useState("");

const [mobileNumber,setMobileNumber]=useState("");

const [emailOtp,setEmailOtp]=useState("");

const [phoneOtp,setPhoneOtp]=useState("");


const navigate = useNavigate();



const {
timeLeft,
canResend,
resetTimer

}=useOtpTimer(60);





const handleVerify = async(e)=>{


e.preventDefault();


try{


await verifyRegister({

    email,

    mobileNumber,

    emailOtp,

    phoneOtp

});



alert("Email and Mobile verified successfully");


navigate("/login");



}
catch(error){


console.log(error);


alert(

error.response?.data?.message ||

"OTP verification failed"

);


}


};







const handleResend = async()=>{


try{


await resendOtp({

email

});


resetTimer();


alert("OTP sent again");


}
catch(error){


console.log(error);


}


};






return(


<div className="container mt-5">


<div className="card p-4 mx-auto"

style={{maxWidth:"400px"}}

>


<h3>

Verify Registration

</h3>



<form onSubmit={handleVerify}>


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

placeholder="Mobile Number"

value={mobileNumber}

onChange={
e=>setMobileNumber(e.target.value)
}

/>





<input

className="form-control mb-3"

placeholder="Email OTP"

value={emailOtp}

maxLength="6"

onChange={
e=>setEmailOtp(e.target.value)
}

/>





<input

className="form-control mb-3"

placeholder="Phone OTP"

value={phoneOtp}

maxLength="6"

onChange={
e=>setPhoneOtp(e.target.value)
}

/>




<button

className="btn btn-primary w-100"

>

Verify Account

</button>


</form>





<hr/>




{

canResend ?


<button

className="btn btn-outline-secondary w-100"

onClick={handleResend}

>

Resend OTP

</button>



:


<p className="text-center">

Resend available in {timeLeft}s

</p>



}



</div>


</div>


);


}


export default VerifyOtp;