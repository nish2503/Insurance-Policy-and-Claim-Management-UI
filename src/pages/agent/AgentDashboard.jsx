import { useEffect, useState } from "react";


import DashboardLayout 
from "../../components/layout/DashboardLayout";


import DataTable 
from "../../components/common/DataTable";


import Button 
from "../../components/common/Button";


import StatusBadge 
from "../../components/common/StatusBadge";


import Loader 
from "../../components/common/Loader";


import EmptyState 
from "../../components/common/EmptyState";


import Card 
from "../../components/common/Card";


import {
    getAgentClaims,
    reviewClaim
} from "../../api/agentApi";



function AgentDashboard(){



const [claims,setClaims] = useState([]);

const [loading,setLoading] = useState(true);




useEffect(()=>{


loadClaims();


},[]);





async function loadClaims(){


try{


setLoading(true);



const res = await getAgentClaims();



setClaims(

res.data.records || []

);



}
catch(error){


console.log(error);


}

finally{


setLoading(false);


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



}
catch(error){


console.log(error);


}



}





if(loading){


return(


<DashboardLayout>


<Loader/>


</DashboardLayout>


);


}






const pendingClaims = claims.filter(

c=>c.status==="PENDING"

);







return(


<DashboardLayout>



<Card title="Agent Dashboard">





{

pendingClaims.length > 0 ?



<DataTable


columns={[



{

key:"id",

label:"Claim ID"

},



{

key:"customerName",

label:"Customer"

},



{

key:"policyNumber",

label:"Policy"

},



{

key:"status",

label:"Status",

render:(row)=>(

<StatusBadge

status={row.status}

/>

)

},




{

key:"action",

label:"Action",

render:(row)=>(


<Button


onClick={()=>handleReview(row.id)}

>


Review


</Button>


)

}



]}




data={pendingClaims}



/>



:


<EmptyState

message="No Pending Claims"

/>



}




</Card>



</DashboardLayout>



);



}



export default AgentDashboard;