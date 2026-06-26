import { useState } from "react";


function DataTable({

    columns,

    data,

    rowsPerPageOptions=[5,10,20],

    searchable=true,

    searchKeys=[]

}){


const [search,setSearch] = useState("");

const [rowsPerPage,setRowsPerPage] = useState(5);

const [currentPage,setCurrentPage] = useState(1);




// SEARCH

const filteredData = data.filter(row=>{


if(!searchable || !search)

return true;


return searchKeys.some(key =>


String(row[key] || "")

.toLowerCase()

.includes(

search.toLowerCase()

)


);


});





// PAGINATION

const totalPages = Math.ceil(

filteredData.length / rowsPerPage

);



const startIndex =

(currentPage - 1) * rowsPerPage;



const paginatedData = filteredData.slice(

startIndex,

startIndex + rowsPerPage

);






return(


<div>


{/* SEARCH + ROW SELECT */}


{

searchable &&


<div className="d-flex justify-content-between mb-3">


<input


className="form-control"


style={{maxWidth:"300px"}}


placeholder="Search..."


value={search}


onChange={(e)=>{


setSearch(e.target.value);


setCurrentPage(1);


}}


/>





<select


className="form-select"


style={{maxWidth:"120px"}}


value={rowsPerPage}


onChange={(e)=>{


setRowsPerPage(

Number(e.target.value)

);


setCurrentPage(1);


}}


>


{


rowsPerPageOptions.map(size=>(


<option


key={size}


value={size}


>


{size} rows


</option>


))


}



</select>



</div>


}






<table className="table table-hover table-bordered">



<thead className="table-dark">


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


paginatedData.length ?



paginatedData.map((row,index)=>(


<tr key={index}>


{


columns.map(col=>(



<td key={col.key}>


{


col.render ?


col.render(row)


:


row[col.key]



}


</td>



))


}



</tr>



))


:



<tr>


<td


colSpan={columns.length}


className="text-center"


>


No Records Found


</td>


</tr>



}



</tbody>




</table>







{/* PAGINATION BUTTONS */}



{


totalPages > 1 &&



<div className="d-flex justify-content-center gap-2 mt-3">


<button


className="btn btn-outline-primary"


disabled={currentPage===1}


onClick={()=>setCurrentPage(currentPage-1)}


>


Previous


</button>






<span className="pt-2">


Page {currentPage} of {totalPages}


</span>






<button


className="btn btn-outline-primary"


disabled={currentPage===totalPages}


onClick={()=>setCurrentPage(currentPage+1)}


>


Next


</button>




</div>



}





</div>


)


}



export default DataTable;