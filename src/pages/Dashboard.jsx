import AdminDashboard from "./AdminDashboard";
import AgentDashboard from "./AgentDashboard";
import CustomerDashboard from "./CustomerDashboard";

function Dashboard() {
  const role = localStorage.getItem("role");

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "AGENT") {
    return <AgentDashboard />;
  }

  if (role === "CUSTOMER") {
    return <CustomerDashboard />;
  }

  return <h3>Unauthorized</h3>;
}

export default Dashboard;
