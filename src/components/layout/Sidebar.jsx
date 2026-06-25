import { Link } from "react-router-dom";


function Sidebar(){

const role = localStorage.getItem("role");


return (

<div>


<h4>Insurance System</h4>



{
role==="ADMIN" && (

<>

<Link to="/admin">
Dashboard
</Link>


<Link to="/admin/customers">
Customers
</Link>


<Link to="/admin/products">
Products
</Link>


<Link to="/admin/plans">
Plans
</Link>


</>

)



}




{
role==="AGENT" && (

<>


<Link to="/agent">
Dashboard
</Link>


<Link to="/agent/customers">
Customers
</Link>


<Link to="/agent/issue-policy">
Issue Policy
</Link>


<Link to="/agent/policies">
Policies
</Link>


<Link to="/agent/review-claims">
Claims
</Link>


<Link to="/agent/payments">
Payments
</Link>


</>


)

}





{
role==="CUSTOMER" && (

<>


<Link to="/customer">
Dashboard
</Link>

<Link to="/customer/profile">
My Profile
</Link>

<Link to="/customer/products">
Browse Products
</Link>


<Link to="/customer/policies">
My Policies
</Link>


<Link to="/customer/claims">
My Claims
</Link>


<Link to="/customer/payments">
Payments
</Link>



</>


)

}




</div>

);

}


export default Sidebar;