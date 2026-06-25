import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../../api/authApi";


function Register(){


const [form,setForm]=useState({

fullName:"",

email:"",

password:"",

mobileNumber:""


});

// Added independent state for toggling password visibility
const [showPassword, setShowPassword] = useState(false);

const navigate = useNavigate();



const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value


});


};





const handleRegister=async(e)=>{


e.preventDefault();


try{


await register(form);


alert("Registration successful. Verify OTP");


navigate("/verify-otp");


}

catch(error){


console.log(error.response?.data);


alert(

error.response?.data?.message ||

"Registration failed"

);


}



};

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};





return(


<div className="container mt-5">


<div

className="card p-4 mx-auto"

style={{maxWidth:"400px"}}

>


<h3>

Register

</h3>




<form onSubmit={handleRegister}>



<input

className="form-control mb-3"

name="fullName"

placeholder="Full Name"

value={form.fullName}

onChange={handleChange}

/>





<input

className="form-control mb-3"

name="email"

placeholder="Email"

value={form.email}

onChange={handleChange}

/>





<input

className="form-control mb-3"

name="mobileNumber"

placeholder="Mobile Number"

value={form.mobileNumber}

onChange={handleChange}

/>




{/* Wrapped inside an input-group for the clean bootstrap icon layout */}
<div className="input-group mb-3">
  <input

  className="form-control"

  type={showPassword ? "text" : "password"}

  name="password"

  placeholder="Password"

  value={form.password}

  onChange={handleChange}

  />
  <button
    className="btn btn-outline-secondary"
    type="button"
    onClick={togglePasswordVisibility}
    style={{ borderLeft: "none", zIndex: 5 }}
  >
    {showPassword ? (
      <i className="bi bi-eye-slash-fill text-muted"></i>
    ) : (
      <i className="bi bi-eye-fill text-muted"></i>
    )}
  </button>
</div>





<button

className="btn btn-primary w-100"

>

Register

</button>




</form>



</div>


</div>


);


}


export default Register;
