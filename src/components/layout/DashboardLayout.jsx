import Navbar from "./Navbar";

import Sidebar from "./Sidebar";

import Topbar from "./Topbar";



function DashboardLayout({children}){


return(


<div>


<Navbar />



<div className="d-flex">


<Sidebar />



<div className="flex-grow-1">


<Topbar />



<div className="p-4">


{children}


</div>



</div>


</div>


</div>


);


}


export default DashboardLayout;