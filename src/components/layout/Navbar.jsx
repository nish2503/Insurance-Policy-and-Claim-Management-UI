import { useDispatch } from "react-redux";

import { logout } from "../../features/auth/authSlice";

import { useNavigate } from "react-router-dom";

import ThemeToggle from "../common/ThemeToggle";


function Navbar(){


const dispatch = useDispatch();

const navigate = useNavigate();



const handleLogout = ()=>{


dispatch(logout());


navigate("/login");


};



return(


<nav className="navbar navbar-expand-lg navbar-dark bg-primary">


<div className="container-fluid">


<span className="navbar-brand">

Insurance System

</span>



<div className="d-flex gap-3">


<ThemeToggle />



<button

className="btn btn-danger"

onClick={handleLogout}

>

Logout

</button>


</div>



</div>


</nav>


);


}



export default Navbar;