import { createContext, useState, useEffect } from "react";


export const ThemeContext = createContext();



function ThemeProvider({children}){


const [theme,setTheme] = useState(

localStorage.getItem("theme") || "light"

);




useEffect(()=>{


document.body.classList.remove(
"light",
"dark"
);


document.body.classList.add(theme);



localStorage.setItem(
"theme",
theme
);



},[theme]);





function toggleTheme(){


setTheme(prev =>

prev === "light"

?

"dark"

:

"light"

);


}





return(


<ThemeContext.Provider


value={{

theme,

toggleTheme

}}


>


{children}


</ThemeContext.Provider>


);


}


export default ThemeProvider;