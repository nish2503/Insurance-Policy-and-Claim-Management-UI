import { useEffect, useState } from "react";

import {Link} from "react-router-dom";

import DashboardLayout 
from "../../components/layout/DashboardLayout";

import DashboardCard 
from "../../components/common/DashboardCard";

import DataTable 
from "../../components/common/DataTable";

import Loader 
from "../../components/common/Loader";

import EmptyState 
from "../../components/common/EmptyState";

import StatusBadge 
from "../../components/common/StatusBadge";

import Card 
from "../../components/common/Card";


import {
  getMyProfile,
  getMyClaims,
  getMyPolicies,
  getProducts,
  getPlans,
  getMyPremiumPayments
} from "../../api/customerApi";

import {useNavigate} from "react-router-dom";



function CustomerDashboard(){


const [profile,setProfile]=useState(null);

const [policies,setPolicies]=useState([]);

const [claims,setClaims]=useState([]);

const [payments,setPayments]=useState([]);

const [loading,setLoading]=useState(true);

const navigate = useNavigate();



useEffect(()=>{

loadData();

},[]);



async function loadData(){

try{


setLoading(true);


const profileRes = await getMyProfile();

const claimRes = await getMyClaims();

const policyRes = await getMyPolicies();

//const productRes = await getProducts();

// const planRes = await getPlans();

 const paymentRes = await getMyPremiumPayments();

setProfile(profileRes.data);

setClaims(claimRes.data.records || []);

setPolicies(policyRes.data.records || []);

// setProducts(productRes.data.records || []);

// setPlans(planRes.data.records || []);

setPayments(paymentRes.data || []);


}

catch(error){


if(error.response?.status===404){

navigate("/customer/create-profile");

}

console.log(error);


}

finally{

setLoading(false);

}

}


if(loading){

return (

<DashboardLayout>

<Loader/>

</DashboardLayout>

);

}



return(

<DashboardLayout>


<Card title="Customer Dashboard">


<h2>
Welcome, {profile?.fullName}
</h2>



<div className="row mt-4">


<DashboardCard

title="Profile Status"

count="✅ Completed"

/>


<DashboardCard

title="My Policies"

count={policies.length}

/>


<DashboardCard

title="Claims"

count={claims.length}

/>


<DashboardCard

title="Premium Due"

count={
payments
.filter(
p=>p.paymentStatus==="PENDING"
)
.reduce(
(sum,p)=>sum+p.amount,
0
)
}

/>


</div>



<h3 className="mt-5">
Quick Actions
</h3>



<div className="d-flex gap-3">


<Link
className="btn btn-primary"
to="/customer/plans"
>
Browse Plans
</Link>



<Link
className="btn btn-success"
to="/customer/purchase-policy"
>
Buy Policy
</Link>



<Link
className="btn btn-warning"
to="/customer/pay-premium"
>
Pay Premium
</Link>



<Link
className="btn btn-danger"
to="/customer/raise-claim"
>
Raise Claim
</Link>



</div>



</Card>


</DashboardLayout>


)

















}


export default CustomerDashboard;