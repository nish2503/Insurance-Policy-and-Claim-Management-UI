function DataTable({

columns,

data

}){


return(


<table className="table table-bordered">


<thead>


<tr>


{

columns.map(col=>(


<th key={col.key}>


{col.label}


</th>


))


}


</tr>


</thead>





<tbody>



{

data.length === 0 ?


(


<tr>

<td

colSpan={columns.length}

className="text-center"

>


No data available


</td>

</tr>


)



:


data.map((row,index)=>(


<tr key={index}>


{


columns.map(col=>(


<td key={col.key}>


{

col.render

?

col.render(row)

:

row[col.key]


}



</td>


))


}



</tr>


))



}



</tbody>



</table>



);


}


export default DataTable;