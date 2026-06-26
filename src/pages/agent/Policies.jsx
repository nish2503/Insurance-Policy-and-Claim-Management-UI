import {useEffect,useState} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";


import {
getAgentPolicies
}
from "../../api/agentApi";
import BackButton from "../../components/common/BackButton";



function Policies(){


const [policies,setPolicies]=useState([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

loadPolicies();

},[]);



async function loadPolicies(){


try{


const res =
await getAgentPolicies();


setPolicies(
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



if(loading){

return(

<DashboardLayout>

<Loader/>


</DashboardLayout>

)

}



return(


<DashboardLayout>


<Card title="Policies">
    <BackButton/>


{

policies.length ?


<DataTable


columns={[

{
key:"policyNumber",
label:"Policy Number"
},

{
key:"customerName",
label:"Customer"
},

{
key:"planName",
label:"Plan"
},

{
key:"policyStatus",
label:"Status"
}


]}


data={policies}

searchKeys={[
"policyNumber",

"customerName",

"planName",

"policyStatus"
]}

/>


:

<EmptyState
message="No Policies Found"
/>


}


</Card>


</DashboardLayout>


);



}


export default Policies;