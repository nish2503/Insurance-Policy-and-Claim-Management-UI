import { useNavigate } from "react-router-dom";


function Unauthorized() {


const navigate = useNavigate();



return (


<div className="container mt-5">


<div className="card p-5 text-center shadow">


<h1 className="text-danger">

403

</h1>


<h3>

Unauthorized Access

</h3>


<p>

You do not have permission to access this page.

</p>



<button

className="btn btn-primary"

onClick={()=>navigate("/")}

>

Go Home

</button>



</div>


</div>


);


}


export default Unauthorized;