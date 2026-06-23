import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {

  const role =
    localStorage.getItem("role");

    console.log("CURRENT ROLE:", role);

  return (
    <Routes>

  <Route
    path="/"
    element={<Login />}
  />

  <Route
    path="/admin"
    element={<AdminDashboard />}
  />

  <Route
    path="/agent"
    element={<AgentDashboard />}
  />

  <Route
    path="/customer"
    element={<CustomerDashboard />}
  />

</Routes>
  );
}

export default App;