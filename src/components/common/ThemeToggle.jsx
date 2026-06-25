import useTheme from "../../hooks/useTheme";


function ThemeToggle(){


const {
theme,
toggleTheme

}=useTheme();




return(


<button

className="btn btn-outline-secondary"

onClick={toggleTheme}

>


{

theme==="light"

?

"🌙 Dark"

:

"☀️ Light"

}


</button>


);



}


export default ThemeToggle;