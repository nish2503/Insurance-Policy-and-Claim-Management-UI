function DashboardCard({
title,
count,
onClick
}){


return(


<div className="col-md-3 mb-4">


<div

className="card shadow h-100"

onClick={onClick}

style={{cursor:"pointer"}}

>


<div className="card-body text-center">


<h5>

{title}

</h5>


<h2 className="text-primary">

{count}

</h2>



<button

className="btn btn-outline-primary"

>

View

</button>


</div>


</div>


</div>


);


}


export default DashboardCard;