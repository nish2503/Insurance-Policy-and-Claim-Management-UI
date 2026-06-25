import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap-icons/font/bootstrap-icons.css";


import {Provider} from "react-redux";

import App from "./App";

import store from "./app/store";

import ThemeProvider 
from "./context/ThemeContext";

ReactDOM.createRoot(
document.getElementById("root")
)
.render(

<React.StrictMode>


<Provider store={store}>


<ThemeProvider>


<App/>


</ThemeProvider>


</Provider>


</React.StrictMode>

);