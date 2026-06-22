import {useEffect,useState} from "react";

import Navbar from "../components/Navbar";

import {
    getAgentClaims,
    reviewClaim
} from "../api/agentApi";


function AgentDashboard(){


const [claims,setClaims]=useState([]);


useEffect(()=>{

    
  loadClaims();

},[]);



async function loadClaims(){

    try{

        const res = await getAgentClaims();


        setClaims(
            res.data.records || []
        );


    }catch(error){

        console.log(error);

    }

}




async function handleReview(id){


    const data={

    recommendedStatus:"APPROVED",
    remarks:"Documents verified"

};


    try{


        await reviewClaim(
            id,
            data
        );


        loadClaims();


    }catch(error){

        console.log(error);

    }

}





return(

<>


<Navbar/>


<div className="container-fluid bg-light min-vh-100 p-4">


<h2>
Agent Dashboard
</h2>


<table className="table">


<thead>

<tr>

<th>Claim ID</th>
<th>Customer</th>
<th>Policy</th>
<th>Status</th>
<th>Action</th>


</tr>


</thead>


<tbody>


{

claims
.filter(c=>c.status==="PENDING")
.map(c=>(


<tr key={c.id}>


<td>
{c.id}
</td>


<td>
{c.customerName}
</td>


<td>
{c.policyNumber}
</td>


<td>
{c.status}
</td>


<td>


<button

className="btn btn-primary"

onClick={()=>handleReview(c.id)}

>

Review


</button>


</td>


</tr>



))


}



</tbody>


</table>


</div>



</>


)

}


export default AgentDashboard;