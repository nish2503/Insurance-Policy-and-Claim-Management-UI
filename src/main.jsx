import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/theme.css";

import {Provider} from "react-redux";

import App from "./App";

import store from "./app/store";

import ThemeProvider 
from "./context/ThemeContext";

import ToastProvider
from "./context/ToastContext";

ReactDOM.createRoot(
document.getElementById("root")
)
.render(

<React.StrictMode>


<Provider store={store}>


<ThemeProvider>


<ToastProvider>


<App/>


</ToastProvider>


</ThemeProvider>


</Provider>


</React.StrictMode>

);