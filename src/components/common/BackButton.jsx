import { useNavigate } from "react-router-dom";

function BackButton(){

const navigate = useNavigate();


return(

<button

className="btn btn-outline-secondary mb-3"

onClick={()=>navigate(-1)}

>

← Back

</button>

);

}


export default BackButton;