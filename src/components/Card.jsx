function Card({title,count,active}){


return(

<div className="col-md-4">


<div

className={
`card p-4 ${active?"bg-danger-subtle":""}`
}

>


<h4>
{title}
</h4>


<h2>
Total - {count}
</h2>



</div>


</div>


)


}


export default Card;