import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import BackButton from "../../components/common/BackButton";
import { getMyPolicies, raiseClaim, uploadClaimDocument } from "../../api/customerApi";

function RaiseClaim() {
  const navigate = useNavigate();

  const [policies, setPolicies] = useState([]);
  const [policyId, setPolicyId] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [claimReason, setClaimReason] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [file, setFile] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [maxCoverage, setMaxCoverage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    loadPolicies();
  }, []);


  async function loadPolicies() {
    try {
      const res = await getMyPolicies();

      setPolicies(
        res.data.records ||
        res.data.content ||
        res.data ||
        []
      );

    } catch (error) {
      console.error("Error loading customer active policy files:", error);
    }
  }



  function handlePolicyChange(e) {

    const selectedId = e.target.value;

    setPolicyId(selectedId);
    setClaimAmount("");
    setSuccessMsg("");
    setErrorMsg("");


    if (fieldErrors.policyId) {
      setFieldErrors(prev => ({
        ...prev,
        policyId: ""
      }));
    }


    if (!selectedId) {

      setMaxCoverage(null);
      return;

    }



    const matchedPolicy =
      policies.find(
        (p) =>
          String(p.policyId || p.id) ===
          String(selectedId)
      );



    if (matchedPolicy) {

      setMaxCoverage(
        matchedPolicy.coverageAmount || null
      );

    }
    else {

      setMaxCoverage(null);

    }

  }





  function handleFileChange(e) {


    const selectedFile =
      e.target.files[0];


    setErrorMsg("");



    if (!selectedFile) {

      setFile(null);
      return;

    }



    if (selectedFile.size > 5 * 1024 * 1024) {


      setFieldErrors(prev => ({
        ...prev,
        file:
        "File size exceeds the 5MB limit. Please upload a smaller document."
      }));


      e.target.value = null;

      setFile(null);

      return;

    }



    setFile(selectedFile);

  }






  function handleInputChange(setter, name) {

    return (e)=>{


      setter(e.target.value);



      if(fieldErrors[name]){

        setFieldErrors(prev=>({
          ...prev,
          [name]:""
        }));

      }

    };

  }






  function handleCancel() {

    if(window.confirm(
      "Are you sure you want to discard this claim request?"
    )){

      navigate("/customer/claims");

    }

  }







  function validateForm(){


    const errors = {};

    const today =
      new Date()
      .toISOString()
      .split("T")[0];



    if(!policyId)

      errors.policyId =
      "Please select an active policy from the list";




    if(!claimAmount)

      errors.claimAmount =
      "Claim amount field is required";

    else if(Number(claimAmount)<=0)

      errors.claimAmount =
      "Claim amount must be a positive value greater than zero";

    else if(
      maxCoverage &&
      Number(claimAmount) > Number(maxCoverage)
    )

      errors.claimAmount =
      `Claim amount cannot exceed your policy total coverage limit of ₹${maxCoverage}`;





    if(!claimReason.trim())

      errors.claimReason =
      "Reason for claim is required to process assessment context";


    else if(claimReason.trim().length < 10)

      errors.claimReason =
      "Please provide a descriptive reason (minimum 10 characters)";





    if(!incidentDate)

      errors.incidentDate =
      "Incident occurrence date field is required";


    else if(incidentDate > today)

      errors.incidentDate =
      "Incident date cannot be set in the future";



    return errors;

  }









  async function handleSubmit(e){

    e.preventDefault();


    setSuccessMsg("");
    setErrorMsg("");
    setFieldErrors({});



    const clientErrors =
      validateForm();



    if(Object.keys(clientErrors).length > 0){

      setFieldErrors(clientErrors);
      return;

    }




    setSubmitting(true);



    try{


      let uploadedDocument = [];



      if(file){


        const uploadResponse =
          await uploadClaimDocument(file);



        uploadedDocument=[

          {

            documentName:file.name,

            documentType:file.type,

            documentReference:
            uploadResponse.data.fileUrl ||
            uploadResponse.data

          }

        ];

      }






      await raiseClaim({

        policyId:Number(policyId),

        claimAmount:Number(claimAmount),

        claimReason:claimReason,

        incidentDate:incidentDate,

        supportingDocuments:uploadedDocument

      });





      setSuccessMsg(
        "Claim request submitted successfully!"
      );



      setPolicyId("");

      setClaimAmount("");

      setClaimReason("");

      setIncidentDate("");

      setFile(null);

      setMaxCoverage(null);

      document
      .getElementById("claimForm")
      .reset();



    }
    catch(error){


      console.error(error);



      setErrorMsg(
        error.response?.data?.message ||
        "Failed to submit claim request. Please verify and retry."
      );

    }
    finally{

      setSubmitting(false);

    }


  }









  return (

    <DashboardLayout>


      <BackButton />


      <Card title="Raise Insurance Settlement Claim">


      {
      successMsg &&

      <div className="alert alert-success mt-3 shadow-sm">

        <strong>Success!</strong>
        {successMsg}

      </div>

      }




      {
      errorMsg &&

      <div className="alert alert-danger mt-3 shadow-sm">

        <strong>Error!</strong>
        {errorMsg}

      </div>

      }






<form
onSubmit={handleSubmit}
id="claimForm"
className="mt-4"
noValidate
>





<div className="mb-3">


<label className="form-label font-weight-bold">

Select Covered Policy

</label>



<select

className={`form-select ${
fieldErrors.policyId
?
"is-invalid"
:
""
}`}

value={policyId}

onChange={handlePolicyChange}

disabled={submitting}

>


<option value="">

Choose Policy

</option>



{

policies.map((p)=>(


<option

key={p.policyId || p.id}

value={p.policyId || p.id}

>


{p.policyNumber} -
{p.planName || "Insurance Plan"}


</option>


))


}



</select>


</div>







{
maxCoverage &&

<div className="alert alert-info py-2">

ℹ️ Maximum available coverage limit:
₹{maxCoverage}

</div>

}






<div className="mb-3">


<label className="form-label">

Requested Claim Settlement Amount

</label>


<input

type="number"

className="form-control"

value={claimAmount}

onChange={
handleInputChange(
setClaimAmount,
"claimAmount"
)
}

disabled={
submitting || !policyId
}

/>


</div>






<div className="mb-3">


<label className="form-label">

Reason for Claim

</label>


<textarea

className="form-control"

rows="4"

value={claimReason}

onChange={
handleInputChange(
setClaimReason,
"claimReason"
)
}

/>


</div>







<div className="mb-3">


<label className="form-label">

Date of Incident

</label>



<input

type="date"

className="form-control"

value={incidentDate}

onChange={
handleInputChange(
setIncidentDate,
"incidentDate"
)
}

/>


</div>






<div className="mb-4">


<label className="form-label">

Upload Supporting Document

</label>



<input

type="file"

className="form-control"

accept=".pdf,.png,.jpeg,.jpg"

onChange={handleFileChange}

disabled={submitting}

/>


</div>







{/* CONTROL PANEL BUTTONS */}

<div className="mt-4 d-flex gap-2">


<button

type="submit"

className="btn btn-danger px-4 shadow-sm"

disabled={
submitting || !policyId
}

>


{
submitting
?
"Uploading & Processing..."
:
"Submit Claim Request"
}


</button>





<button

type="button"

className="btn btn-secondary px-4 shadow-sm"

onClick={handleCancel}

disabled={submitting}

>


Cancel


</button>



</div>







</form>


</Card>


</DashboardLayout>


  );

}



export default RaiseClaim;