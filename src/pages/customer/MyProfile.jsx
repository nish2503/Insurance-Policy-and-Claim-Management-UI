import { useEffect, useState } from "react";
import { getMyProfile, updateCustomerProfile } from "../../api/customerApi";
import BackButton from "../../components/common/BackButton";
import api from "../../api/axios";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const [showOtpModal, setShowModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    nomineeName: "",
    nomineeRelation: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);


  async function loadProfile() {
    try {
      const res = await getMyProfile();

      setProfile(res.data);

      setForm({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        mobileNumber: res.data.mobileNumber || "",
        dateOfBirth: res.data.dateOfBirth || "",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        pinCode: res.data.pinCode || "",
        nomineeName: res.data.nomineeName || "",
        nomineeRelation: res.data.nomineeRelation || "",
      });

    } catch(error){

      setErrors({
        general:"Unable to load profile"
      });

    }
  }



  function validateForm(){

    const localErrors={};

    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pinRegex=/^[0-9]{6}$/;

    const cleanedMobile =
    form.mobileNumber.replace(/\D/g,"").slice(-10);

    const mobileRegex=/^[6-9][0-9]{9}$/;


    if(!form.fullName.trim())
      localErrors.fullName="Full name required";


    if(!form.email.trim())
      localErrors.email="Email required";

    else if(!emailRegex.test(form.email))
      localErrors.email="Invalid email";


    if(!form.mobileNumber.trim())
      localErrors.mobileNumber="Mobile required";

    else if(!mobileRegex.test(cleanedMobile))
      localErrors.mobileNumber="Invalid mobile number";


    if(!form.dateOfBirth)
      localErrors.dateOfBirth="DOB required";


    if(!form.address.trim())
      localErrors.address="Address required";


    if(!form.city.trim())
      localErrors.city="City required";


    if(!form.state.trim())
      localErrors.state="State required";


    if(!form.pinCode.trim())
      localErrors.pinCode="PIN required";

    else if(!pinRegex.test(form.pinCode))
      localErrors.pinCode="PIN must be 6 digits";


    if(!form.nomineeName.trim())
      localErrors.nomineeName="Nominee name required";


    if(!form.nomineeRelation.trim())
      localErrors.nomineeRelation="Nominee relation required";


    return localErrors;

  }




  function handleChange(e){

    setForm({

      ...form,

      [e.target.name]:e.target.value

    });

  }





  async function executeProfileUpdate(){

    try{


      await updateCustomerProfile({

        ...form,

        email:form.email.trim().toLowerCase(),

        mobileNumber:
        form.mobileNumber.replace(/\D/g,"").slice(-10)

      });



      setSuccess("Profile updated successfully");

      setEdit(false);

      setShowModal(false);

      loadProfile();


    }catch(error){

      setErrors({

        general:
        error.response?.data?.message ||
        "Profile update failed"

      });

    }

  }





  async function save(){

    setSuccess("");

    setErrors({});

    setOtpError("");


    const validation=validateForm();


    if(Object.keys(validation).length){

      setErrors({
        validationErrors:validation
      });

      return;

    }



    const isEmailChanged =
    form.email.trim().toLowerCase() !==
    profile.email.trim().toLowerCase();



    if(isEmailChanged){


      setSendingOtp(true);


      try{


        await api.post(
          "/otp/email/send",
          {
            email:
            form.email.trim().toLowerCase()
          }
        );


        setShowModal(true);


      }catch(error){

        setErrors({

          general:
          error.response?.data?.message ||
          "Failed to send OTP"

        });


      }finally{

        setSendingOtp(false);

      }



    }else{


      executeProfileUpdate();


    }


  }






  async function handleVerifyOtpSubmit(){


    if(!otpValue.trim()){

      setOtpError("Please enter OTP");

      return;

    }


    try{


      const response =
      await api.post(
        "/otp/email/verify",
        {

          email:
          form.email.trim().toLowerCase(),

          otp:otpValue.trim()

        }
      );



      if(response.data===true){

        executeProfileUpdate();

      }else{

        setOtpError("Invalid OTP");

      }



    }catch(error){


      setOtpError(
        error.response?.data?.message ||
        "OTP verification failed"
      );


    }


  }






return (

<div className="container mt-5">


<BackButton/>


<h3>My Profile</h3>


{success &&
<div className="alert alert-success">
{success}
</div>
}


{errors.general &&
<div className="alert alert-danger">
{errors.general}
</div>
}



{profile &&

<div className="card p-4 shadow-sm">


{edit ?


<>


{
Object.keys(form).map(field=>(


<div className="mb-3" key={field}>


<label className="form-label text-capitalize">

{field}

</label>


<input

className={`form-control ${
errors.validationErrors?.[field]
?
"is-invalid"
:
""
}`}

name={field}

value={form[field]}

onChange={handleChange}

/>


</div>


))

}



<button
className="btn btn-success"
onClick={save}
>

Save Changes

</button>



</>


:


<>


<p><b>Name:</b>{profile.fullName}</p>

<p><b>Email:</b>{profile.email}</p>


<button

className="btn btn-primary"

onClick={()=>setEdit(true)}

>

Edit Profile

</button>



</>


}


</div>


}





{showOtpModal &&


<div

className="modal show d-block"

style={{
backgroundColor:"rgba(0,0,0,0.5)"
}}

>


<div className="modal-dialog">


<div className="modal-content">


<div className="modal-header">


<h5>

Email Verification

</h5>


</div>


<div className="modal-body">


{otpError &&

<div className="alert alert-danger">

{otpError}

</div>

}



<input

className="form-control"

value={otpValue}

maxLength="6"

onChange={
e=>setOtpValue(
e.target.value.replace(/\D/g,"")
)
}

/>


</div>



<div className="modal-footer">


<button

className="btn btn-success"

onClick={handleVerifyOtpSubmit}

>

Verify & Save Profile

</button>


<button

className="btn btn-secondary"

onClick={()=>setShowModal(false)}

>

Cancel

</button>


</div>



</div>


</div>


</div>


}



</div>


);


}


export default MyProfile;