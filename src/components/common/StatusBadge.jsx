function StatusBadge({status}){


let color="secondary";


if(status==="ACTIVE")
color="success";


if(status==="PENDING")
color="warning";


if(status==="REJECTED")
color="danger";



return(

<span

className={`badge bg-${color}`}

>

{status}

</span>

);


}


export default StatusBadge;