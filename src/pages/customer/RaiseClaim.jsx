import {useEffect,useState} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";

import {
 getMyPolicies,
 raiseClaim
} from "../../api/customerApi";


function RaiseClaim(){


const [policies,setPolicies]=useState([]);

const [policyId,setPolicyId]=useState("");

const [claimAmount,setClaimAmount]=useState("");

const [claimReason,setClaimReason]=useState("");

const [incidentDate,setIncidentDate]=useState("");



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


await raiseClaim({


policyId:policyId,


claimAmount:claimAmount,


claimReason:claimReason,


incidentDate:incidentDate,


supportingDocuments:[]

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