import {useEffect,useState} from "react";

import {getPolicies} from "../api/policyApi";


function Policies(){


const [policies,setPolicies]=useState([]);



useEffect(()=>{


getPolicies()

.then(res=>{

setPolicies(res.data)

})


},[]);



return(

<div className="container mt-5">


<h2>
Policies
</h2>


<table className="table">


<thead>

<tr>

<th>Policy Number</th>

<th>Status</th>

</tr>

</thead>



<tbody>


{

policies.map(p=>(


<tr key={p.id}>


<td>
{p.policyNumber}
</td>


<td>
{p.status}
</td>


</tr>


))


}



</tbody>


</table>



</div>


)


}


export default Policies;