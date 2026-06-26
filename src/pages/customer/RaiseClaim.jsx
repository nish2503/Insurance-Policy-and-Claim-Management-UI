import {useEffect,useState} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import BackButton from "../../components/common/BackButton";
import {
 getMyPolicies,
 raiseClaim,
 uploadClaimDocument
} from "../../api/customerApi";


function RaiseClaim(){


const [policies,setPolicies]=useState([]);

const [policyId,setPolicyId]=useState("");

const [claimAmount,setClaimAmount]=useState("");

const [claimReason,setClaimReason]=useState("");

const [incidentDate,setIncidentDate]=useState("");

const [file,setFile]=useState(null);

const [document,setDocument]=useState(null);



useEffect(()=>{

loadPolicies();

},[]);



async function loadPolicies(){

try{

const res=await getMyPolicies();

setPolicies(
res.data.records || []
);


}
catch(error){

console.log(error);

}

}

async function handleSubmit(e){

e.preventDefault();


try{


let uploadedDocument=[];



if(file){


const uploadResponse =
await uploadClaimDocument(file);



uploadedDocument=[

{

documentName:file.name,

documentType:file.type,

documentReference:
uploadResponse.data.fileUrl

}

];


}



await raiseClaim({


policyId,

claimAmount,

claimReason,

incidentDate,


supportingDocuments:
uploadedDocument


});



alert(
"Claim Raised Successfully"
);


}

catch(error){

console.log(error);


alert(

error.response?.data?.message ||

"Claim failed"

);


}

}



return(


<DashboardLayout>

<BackButton/>
<Card title="Raise Claim">


<form onSubmit={handleSubmit}>


<label>
Select Policy
</label>


<select

className="form-control"

value={policyId}

onChange={
e=>setPolicyId(e.target.value)
}

>


<option value="">
Select Policy
</option>


{

policies.map(p=>(


<option

key={p.policyId}

value={p.policyId}

>


{p.policyNumber}

-
{p.planName}


</option>


))


}


</select>




<label className="mt-3">

Claim Amount

</label>


<input

type="number"

className="form-control"

value={claimAmount}

onChange={
e=>setClaimAmount(e.target.value)
}

/>





<label className="mt-3">

Reason

</label>


<textarea

className="form-control"

value={claimReason}

onChange={
e=>setClaimReason(e.target.value)
}

/>





<label className="mt-3">

Incident Date

</label>


<input

type="date"

className="form-control"

value={incidentDate}

onChange={
e=>setIncidentDate(e.target.value)
}

/>

<label className="mt-3">

Supporting Document

</label>


<input

type="file"

className="form-control"

onChange={
e=>setFile(e.target.files[0])
}

/>



<button

className="btn btn-danger mt-3"

>

Submit Claim

</button>



</form>


</Card>


</DashboardLayout>


)


}


export default RaiseClaim;