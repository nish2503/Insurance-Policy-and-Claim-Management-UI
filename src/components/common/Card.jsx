function Card({title,children}){


return(

<div className="card shadow p-4">


<h4>

{title}

</h4>


<div>

{children}

</div>


</div>

);


}


export default Card;