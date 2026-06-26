import {useEffect,useState} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/common/Card";
import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import {
getAgentPayments
}
from "../../api/agentApi";
import BackButton from "../../components/common/BackButton";


function Payments(){


const [payments,setPayments]=useState([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

loadPayments();

},[]);



async function loadPayments(){


try{


const res = await getAgentPayments();


setPayments(
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


<Card title="Premium Payments">
    <BackButton/>


{

payments.length ?


<DataTable

columns={[


{
key:"paymentId",
label:"ID"
},


{
key:"policyNumber",
label:"Policy"
},


{
key:"customerName",
label:"Customer"
},


{
key:"amount",
label:"Amount"
},


{
key:"paymentStatus",
label:"Status"
}


]}


data={payments}

searchKeys={[
"policyNumber",

"customerName",

"paymentStatus"
]}

/>


:

<EmptyState

message="No Payments Found"

/>


}


</Card>


</DashboardLayout>


);


}


export default Payments;